import * as THREE from 'three';
import { BaseScene } from './BaseScene';
import { GameEngine } from '../engine/GameEngine';

interface Platform {
    mesh: THREE.Mesh;
    halfWidth: number;
    halfDepth: number;
    isTwin: boolean;
    twinScored: boolean;
    color: THREE.Color;
}

const TWIN_COLORS = [0xff44aa, 0xffcc00, 0x44ff88, 0xff6600, 0xcc44ff];

export class GameScene extends BaseScene {
    private ball!: THREE.Mesh;
    private platforms: Platform[] = [];
    private ballVelocityX = 0;
    private ballVelocityY = 0;
    private isGrounded = false;
    private spaceHeld = false;
    private elapsedTime = 0;

    // Base speeds — all scale together via speedMult
    private readonly BASE_SCROLL_SPEED = 6;
    private readonly BASE_BALL_SPEED = 6;
    private readonly BASE_JUMP_FORCE = 10;
    private readonly GRAVITY = -18;
    private readonly SPEED_RAMP = 0.015;   // multiplier gain per second
    private readonly MAX_SPEED_MULT = 2.5;
    private readonly SPAWN_INTERVAL = 1.4;

    private readonly BASE_BALL_COLOR = new THREE.Color(0x00ffff);

    private platformSpawnTimer = 0;
    private scoreTimer = 0;

    // All dynamic speeds derive from a single multiplier so they stay in sync
    private get speedMult(): number {
        return Math.min(1 + this.elapsedTime * this.SPEED_RAMP, this.MAX_SPEED_MULT);
    }
    private get scrollSpeed(): number { return this.BASE_SCROLL_SPEED * this.speedMult; }
    private get ballSpeed(): number    { return this.BASE_BALL_SPEED   * this.speedMult; }
    private get jumpForce(): number    { return this.BASE_JUMP_FORCE   * this.speedMult; }

    constructor(engine: GameEngine) {
        super(engine);
        this.setupScene();
    }

    private setupScene(): void {
        this.scene.fog = new THREE.Fog(0x000000, 20, 60);

        const ambientLight = new THREE.AmbientLight(0x404060);
        this.scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 1);
        dirLight.position.set(5, 10, 5);
        this.scene.add(dirLight);

        const cam = this.camera as THREE.PerspectiveCamera;
        cam.position.set(0, 5, 10);
        cam.lookAt(0, 0, 0);

        this.createBall();
    }

    private createBall(): void {
        const geo = new THREE.SphereGeometry(0.5, 16, 16);
        const mat = new THREE.MeshPhongMaterial({ color: 0x00ffff, emissive: 0x003344 });
        this.ball = new THREE.Mesh(geo, mat);
        this.ball.position.set(0, 2, 0);
        this.scene.add(this.ball);
    }

    private spawnPlatform(zPos: number): void {
        const width = 2.5 + Math.random() * 3;
        const depth = 3;
        const xPos = (Math.random() - 0.5) * 5;

        // Normal tile
        const geo = new THREE.BoxGeometry(width, 0.4, depth);
        const mat = new THREE.MeshPhongMaterial({ color: 0x0055cc, emissive: 0x001133 });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(xPos, 0, zPos);
        this.scene.add(mesh);
        this.platforms.push({ mesh, halfWidth: width / 2, halfDepth: depth / 2, isTwin: false, twinScored: false, color: new THREE.Color(0x0055cc) });

        // 35% chance: spawn a twin tile directly adjacent to the normal one
        if (Math.random() < 0.35) {
            const twinWidth = 1.2 + Math.random() * 1.5;
            const side = Math.random() < 0.5 ? 1 : -1;
            const twinX = xPos + side * (width / 2 + twinWidth / 2 + 0.3);
            const colorHex = TWIN_COLORS[Math.floor(Math.random() * TWIN_COLORS.length)];
            const twinColor = new THREE.Color(colorHex);

            const twinGeo = new THREE.BoxGeometry(twinWidth, 0.4, depth);
            const twinMat = new THREE.MeshPhongMaterial({
                color: twinColor,
                emissive: twinColor,
                emissiveIntensity: 0.35
            });
            const twinMesh = new THREE.Mesh(twinGeo, twinMat);
            twinMesh.position.set(twinX, 0, zPos);
            this.scene.add(twinMesh);
            this.platforms.push({ mesh: twinMesh, halfWidth: twinWidth / 2, halfDepth: depth / 2, isTwin: true, twinScored: false, color: twinColor });
        }
    }

    private clearPlatforms(): void {
        for (const p of this.platforms) this.scene.remove(p.mesh);
        this.platforms = [];
    }

    enter(): void {
        this.engine.resetScore();
        this.ball.position.set(0, 2, 0);
        this.ballVelocityX = 0;
        this.ballVelocityY = 0;
        this.isGrounded = false;
        this.spaceHeld = false;
        this.elapsedTime = 0;
        this.clearPlatforms();
        for (let i = 0; i < 6; i++) this.spawnPlatform(-i * 4);
        this.platformSpawnTimer = 0;
        this.scoreTimer = 0;
        (this.ball.material as THREE.MeshPhongMaterial).color.copy(this.BASE_BALL_COLOR);
        this.engine.getAudioManager().startBackgroundMusic();
    }

    exit(): void {
        this.engine.getAudioManager().stopBackgroundMusic();
    }

    update(deltaTime: number): void {
        this.elapsedTime += deltaTime;

        const input = this.engine.getInputManager().getInputState();
        const curScroll = this.scrollSpeed;
        const curBall   = this.ballSpeed;

        // Horizontal movement
        if (input.left)       this.ballVelocityX = -curBall;
        else if (input.right) this.ballVelocityX =  curBall;
        else                  this.ballVelocityX *= 0.75;

        // Jump — jumpForce scales with speed so arc stays proportional
        if (input.space && this.isGrounded && !this.spaceHeld) {
            this.ballVelocityY = this.jumpForce;
            this.isGrounded = false;
            this.spaceHeld = true;
            this.engine.getAudioManager().playPowerUp();
        }
        if (!input.space) this.spaceHeld = false;

        // Physics — gravity scales with speedMult so jump arc stays proportional at every speed
        this.ballVelocityY += this.GRAVITY * this.speedMult * deltaTime;
        this.ball.position.x += this.ballVelocityX * deltaTime;
        this.ball.position.y += this.ballVelocityY * deltaTime;

        // Visual roll
        this.ball.rotation.z -= this.ballVelocityX * deltaTime * 1.5;
        this.ball.rotation.x -= curScroll * deltaTime * 1.5;

        // Scroll all platforms
        for (const p of this.platforms) {
            p.mesh.position.z += curScroll * deltaTime;
        }

        // Collision — twin tile awards +5 on first landing
        this.isGrounded = false;
        let groundPlatform: Platform | null = null;
        for (const p of this.platforms) {
            if (this.resolveCollision(p)) {
                this.isGrounded = true;
                groundPlatform = p;
                if (p.isTwin && !p.twinScored) {
                    p.twinScored = true;
                    this.engine.addScore(5);
                    this.engine.getAudioManager().playPowerUp();
                }
                break;
            }
        }

        // Smoothly shift ball color to match the twin tile while standing on it, fade back otherwise
        const ballMat = this.ball.material as THREE.MeshPhongMaterial;
        const targetColor = (groundPlatform?.isTwin) ? groundPlatform.color : this.BASE_BALL_COLOR;
        ballMat.color.lerp(targetColor, 0.18);

        // Remove platforms that passed the camera
        this.platforms = this.platforms.filter(p => {
            if (p.mesh.position.z > 15) {
                this.scene.remove(p.mesh);
                return false;
            }
            return true;
        });

        // Spawn new platforms
        this.platformSpawnTimer += deltaTime;
        if (this.platformSpawnTimer >= this.SPAWN_INTERVAL) {
            this.platformSpawnTimer = 0;
            this.spawnPlatform(-20);
        }

        // Passive score every 0.5 s
        this.scoreTimer += deltaTime;
        if (this.scoreTimer >= 0.5) {
            this.scoreTimer = 0;
            this.engine.addScore(1);
        }

        // Camera follows ball horizontally (smooth)
        const cam = this.camera as THREE.PerspectiveCamera;
        cam.position.x += (this.ball.position.x * 0.3 - cam.position.x) * 0.1;

        // Death
        if (this.ball.position.y < -10) {
            this.engine.getAudioManager().playFall();
            this.engine.changeState('GAME_OVER');
        }
    }

    private resolveCollision(p: Platform): boolean {
        const bx = this.ball.position.x, by = this.ball.position.y, bz = this.ball.position.z;
        const px = p.mesh.position.x,    py = p.mesh.position.y,    pz = p.mesh.position.z;

        const withinX = bx > px - p.halfWidth - 0.5 && bx < px + p.halfWidth + 0.5;
        const withinZ = bz > pz - p.halfDepth - 0.5 && bz < pz + p.halfDepth + 0.5;
        const platformTop = py + 0.2;
        const ballBottom  = by - 0.5;
        const landing = ballBottom <= platformTop && ballBottom >= platformTop - 0.8;

        if (withinX && withinZ && landing && this.ballVelocityY <= 0) {
            this.ball.position.y = platformTop + 0.5;
            this.ballVelocityY = 0;
            return true;
        }
        return false;
    }
}
