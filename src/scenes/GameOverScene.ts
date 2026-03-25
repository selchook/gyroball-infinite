import * as THREE from 'three';
import { BaseScene } from './BaseScene';
import { GameEngine } from '../engine/GameEngine';

export class GameOverScene extends BaseScene {
    private gameOverScreen: HTMLElement | null = null;
    private waitForRelease = false;

    constructor(engine: GameEngine) {
        super(engine);
        this.setupScene();
    }

    private setupScene(): void {
        const ambientLight = new THREE.AmbientLight(0x220000);
        this.scene.add(ambientLight);
        this.camera.position.z = 10;
    }

    enter(): void {
        this.gameOverScreen = document.getElementById('gameOverScreen');
        if (this.gameOverScreen) {
            this.gameOverScreen.style.display = 'block';
            const scoreEl = document.getElementById('finalScore');
            if (scoreEl) scoreEl.textContent = `Score: ${this.engine.score}`;
            const bestEl = document.getElementById('finalBest');
            if (bestEl) bestEl.textContent = `Best: ${this.engine.bestScore}`;
        }

        const restartButton = document.getElementById('restartButton');
        if (restartButton) {
            restartButton.onclick = () => this.engine.changeState('PLAYING');
        }

        const menuButton = document.getElementById('menuButton');
        if (menuButton) {
            menuButton.onclick = () => this.engine.changeState('MENU');
        }

        this.waitForRelease = true;
    }

    exit(): void {
        if (this.gameOverScreen) this.gameOverScreen.style.display = 'none';
    }

    update(_deltaTime: number): void {
        const input = this.engine.getInputManager().getInputState();

        if (this.waitForRelease) {
            if (!input.enter && !input.space) this.waitForRelease = false;
            return;
        }

        if (input.enter || input.space) {
            this.engine.changeState('MENU');
        }
    }
}
