import * as THREE from 'three';
import { GameEngine } from './GameEngine';
import { BaseScene } from '../scenes/BaseScene';

export class SceneManager {
    private scenes: Map<string, BaseScene> = new Map();
    private currentScene: BaseScene | null = null;

    constructor(_engine: GameEngine) {
    }

    addScene(name: string, scene: BaseScene): void {
        this.scenes.set(name, scene);
    }

    changeScene(name: string): void {
        const newScene = this.scenes.get(name);
        if (!newScene) {
            console.error(`Scene ${name} not found`);
            return;
        }

        // Exit current scene
        if (this.currentScene) {
            this.currentScene.exit();
        }

        // Enter new scene
        this.currentScene = newScene;
        this.currentScene.enter();
    }

    update(deltaTime: number): void {
        if (this.currentScene) {
            this.currentScene.update(deltaTime);
        }
    }

    render(renderer: THREE.WebGLRenderer): void {
        if (this.currentScene) {
            this.currentScene.render(renderer);
        }
    }

    handleResize(width: number, height: number): void {
        if (this.currentScene) {
            this.currentScene.handleResize(width, height);
        }
    }

    getCurrentScene(): BaseScene | null {
        return this.currentScene;
    }
}