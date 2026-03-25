import { GameEngine } from './engine/GameEngine';

// Initialize the game engine
const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const engine = new GameEngine(canvas);

// Start the engine
engine.start();

// Handle window resize
window.addEventListener('resize', () => {
    engine.handleResize();
});

// Handle visibility changes for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        engine.pause();
    } else {
        engine.resume();
    }
});