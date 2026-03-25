import * as THREE from 'three';
import { BaseScene } from './BaseScene';
import { GameEngine } from '../engine/GameEngine';

export class BootScene extends BaseScene {
    private loadingTime: number = 0;
    private readonly LOADING_DURATION = 1.0;
    private loadingRing!: THREE.Mesh;

    constructor(engine: GameEngine) {
        super(engine);
        this.setupScene();
    }

    private setupScene(): void {
        const geometry = new THREE.RingGeometry(1, 1.2, 8);
        const material = new THREE.MeshBasicMaterial({
            color: 0x00ffff,
            transparent: true,
            opacity: 0.8
        });
        this.loadingRing = new THREE.Mesh(geometry, material);
        this.scene.add(this.loadingRing);
        this.camera.position.z = 5;
    }

    enter(): void {
        this.loadingTime = 0;
        const menuScreen = document.getElementById('menuScreen');
        if (menuScreen) menuScreen.style.display = 'none';
        const gameOverScreen = document.getElementById('gameOverScreen');
        if (gameOverScreen) gameOverScreen.style.display = 'none';
    }

    exit(): void {
        // no cleanup needed
    }

    update(deltaTime: number): void {
        this.loadingTime += deltaTime;
        this.loadingRing.rotation.z += deltaTime * 2;
        if (this.loadingTime >= this.LOADING_DURATION) {
            this.engine.changeState('MENU');
        }
    }
}
