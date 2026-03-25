import * as THREE from 'three';
import { SceneManager } from './SceneManager';
import { InputManager } from './InputManager';
import { AudioManager } from './AudioManager';
import { BootScene } from '../scenes/BootScene';
import { MenuScene } from '../scenes/MenuScene';
import { GameScene } from '../scenes/GameScene';
import { GameOverScene } from '../scenes/GameOverScene';

export type GameState = 'BOOT' | 'MENU' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';

export class GameEngine {
    private renderer: THREE.WebGLRenderer;
    private sceneManager: SceneManager;
    private inputManager: InputManager;
    private audioManager: AudioManager;
    private clock: THREE.Clock;
    private isRunning: boolean = false;
    private isPaused: boolean = false;
    
    public gameState: GameState = 'BOOT';
    public score: number = 0;
    public bestScore: number = 0;

    constructor(canvas: HTMLCanvasElement) {
        // Initialize renderer
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: canvas,
            antialias: true 
        });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setClearColor(0x000000);

        // Initialize systems
        this.clock = new THREE.Clock();
        this.inputManager = new InputManager();
        this.audioManager = new AudioManager();
        this.sceneManager = new SceneManager(this);

        // Register scenes
        this.sceneManager.addScene('BOOT', new BootScene(this));
        this.sceneManager.addScene('MENU', new MenuScene(this));
        this.sceneManager.addScene('PLAYING', new GameScene(this));
        this.sceneManager.addScene('GAME_OVER', new GameOverScene(this));

        // Load best score
        const saved = localStorage.getItem('gyroball-best-score');
        if (saved) {
            this.bestScore = parseInt(saved);
        }
    }

    start(): void {
        this.isRunning = true;
        this.sceneManager.changeScene('BOOT');
        this.gameLoop();
    }

    pause(): void {
        this.isPaused = true;
        this.audioManager.pauseAll();
    }

    resume(): void {
        this.isPaused = false;
        this.audioManager.resumeAll();
        this.clock.start();
    }

    private gameLoop(): void {
        if (!this.isRunning) return;

        requestAnimationFrame(() => this.gameLoop());

        if (this.isPaused) return;

        const deltaTime = this.clock.getDelta();
        
        // Update current scene
        this.sceneManager.update(deltaTime);
        
        // Render current scene
        this.sceneManager.render(this.renderer);
    }

    changeState(newState: GameState): void {
        this.gameState = newState;
        this.sceneManager.changeScene(newState);
    }

    addScore(points: number): void {
        this.score += points;
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem('gyroball-best-score', this.bestScore.toString());
        }
        this.updateScoreDisplay();
    }

    resetScore(): void {
        this.score = 0;
        this.updateScoreDisplay();
    }

    private updateScoreDisplay(): void {
        const scoreElement = document.getElementById('score');
        if (scoreElement) {
            scoreElement.textContent = `Score: ${this.score}`;
        }
    }

    handleResize(): void {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.sceneManager.handleResize(window.innerWidth, window.innerHeight);
    }

    getRenderer(): THREE.WebGLRenderer {
        return this.renderer;
    }

    getInputManager(): InputManager {
        return this.inputManager;
    }

    getAudioManager(): AudioManager {
        return this.audioManager;
    }
}