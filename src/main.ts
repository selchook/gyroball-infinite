import { GameEngine } from './engine/GameEngine';
import { onPlatform } from './ayvago/platform';

// Initialize the game engine
const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const engine = new GameEngine(canvas);

// Start the engine
engine.start();

// Handle window resize
window.addEventListener('resize', () => {
    engine.handleResize();
});

// Pause while the page is hidden or the platform (Ayvago) asks; resume only when neither applies.
let platformPaused = false;
function syncPause(): void {
    if (document.hidden || platformPaused) {
        engine.pause();
    } else {
        engine.resume();
    }
}

document.addEventListener('visibilitychange', syncPause);

onPlatform((platform) => {
    platform.onPause(() => {
        platformPaused = true;
        syncPause();
    });
    platform.onResume(() => {
        platformPaused = false;
        syncPause();
    });
    platform.onMute((muted) => engine.getAudioManager().setPlatformMuted(muted));
});