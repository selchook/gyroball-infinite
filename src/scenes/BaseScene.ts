import * as THREE from 'three';
import { GameEngine } from '../engine/GameEngine';

export abstract class BaseScene {
    protected engine: GameEngine;
    protected scene: THREE.Scene;
    protected camera: THREE.Camera;

    constructor(engine: GameEngine) {
        this.engine = engine;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    }

    abstract enter(): void;
    abstract exit(): void;
    abstract update(deltaTime: number): void;

    render(renderer: THREE.WebGLRenderer): void {
        renderer.render(this.scene, this.camera);
    }

    handleResize(width: number, height: number): void {
        if (this.camera instanceof THREE.PerspectiveCamera) {
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
        }
    }

    getScene(): THREE.Scene {
        return this.scene;
    }

    getCamera(): THREE.Camera {
        return this.camera;
    }
}