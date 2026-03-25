import * as THREE from 'three';
import { BaseScene } from './BaseScene';
import { GameEngine } from '../engine/GameEngine';

export class MenuScene extends BaseScene {
    private menuScreen: HTMLElement | null = null;
    private enterConsumed = false;

    constructor(engine: GameEngine) {
        super(engine);
        this.setupScene();
    }

    private setupScene(): void {
        const ambientLight = new THREE.AmbientLight(0x223344);
        this.scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0x00ffff, 0.5);
        dirLight.position.set(5, 10, 5);
        this.scene.add(dirLight);

        this.camera.position.z = 10;
    }

    enter(): void {
        this.menuScreen = document.getElementById('menuScreen');
        if (this.menuScreen) this.menuScreen.style.display = 'block';

        const startButton = document.getElementById('startButton');
        if (startButton) {
            startButton.onclick = () => this.engine.changeState('PLAYING');
        }

        this.enterConsumed = false;
        this.engine.getAudioManager().startBackgroundMusic();
    }

    exit(): void {
        if (this.menuScreen) this.menuScreen.style.display = 'none';
    }

    update(_deltaTime: number): void {
        const input = this.engine.getInputManager().getInputState();
        if (!this.enterConsumed && (input.enter || input.space)) {
            this.engine.changeState('PLAYING');
        }
        if (!input.enter && !input.space) {
            this.enterConsumed = false;
        }
    }
}
