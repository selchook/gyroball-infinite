# **GYROBALL INFINITE** - Technical Architecture

## 1. Engine Choice: Three.js r168 (rationale)

**Selected: Three.js r168** for its mature WebGL abstraction, excellent physics integration capabilities, and proven performance on web platforms. Three.js provides optimal balance between development velocity and rendering performance for 3D web games, with built-in support for procedural geometry generation and shader materials essential for neon-lit tube environments.

**Key advantages:**
- Native WebGL optimization with fallback support
- Extensive procedural geometry APIs (CylinderGeometry, BufferGeometry)
- Built-in camera controls and scene management
- Strong community ecosystem for physics integration
- Excellent mobile browser compatibility

## 2. Project File Structure

```
gyroball-infinite/
├── src/
│   ├── core/
│   │   ├── Game.js                 # Main game controller
│   │   ├── SceneManager.js         # Scene state management
│   │   ├── InputManager.js         # Unified input handling
│   │   └── AudioManager.js         # Web Audio controller
│   ├── scenes/
│   │   ├── BootScene.js           # Initial loading
│   │   ├── MenuScene.js           # Main menu
│   │   ├── GameScene.js           # Core gameplay
│   │   └── GameOverScene.js       # End state
│   ├── entities/
│   │   ├── Player.js              # Ball physics entity
│   │   ├── TubeSegment.js         # Rotating tube section
│   │   ├── Obstacle.js            # Hazard objects
│   │   └── PowerUp.js             # Boost/score items
│   ├── systems/
│   │   ├── PhysicsSystem.js       # Ball/collision physics
│   │   ├── TubeGenerator.js       # Procedural level creation
│   │   ├── EffectsSystem.js       # Particles/visual FX
│   │   └── CameraController.js    # Follow camera logic
│   ├── materials/
│   │   ├── NeonMaterial.js        # Glowing tube shader
│   │   ├── MetalBallMaterial.js   # Reflective ball shader
│   │   └── ParticleMaterial.js    # Trail/explosion effects
│   └── main.js                    # Entry point
├── public/
│   ├── index.html
│   └── manifest.json
├── vite.config.js
└── package.json
```

## 3. Scene Architecture (Boot→Load→Menu→Game→GameOver)

**Scene Flow:**
1. **BootScene**: WebGL capability check, Three.js initialization (2s max)
2. **MenuScene**: Title screen, play button, settings (persistent)
3. **GameScene**: Active gameplay with infinite tube generation
4. **GameOverScene**: Score display, restart prompt, leaderboard

**Scene Management Pattern:**
```javascript
class SceneManager {
  constructor() {
    this.scenes = new Map();
    this.currentScene = null;
    this.renderer = new THREE.WebGLRenderer();
  }
  
  transition(sceneName, transitionData = {}) {
    // Cross-fade transitions between scenes
    // Cleanup previous scene resources
    // Initialize new scene with context data
  }
}
```

## 4. Game State Machine (exact enum names)

```javascript
const GameState = {
  INITIALIZING: 'INITIALIZING',
  MAIN_MENU: 'MAIN_MENU',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
  GAME_OVER: 'GAME_OVER',
  RESTARTING: 'RESTARTING'
};
```

**State Transitions:**
- INITIALIZING → MAIN_MENU (auto after boot)
- MAIN_MENU → PLAYING (play button)
- PLAYING ↔ PAUSED (escape/focus loss)
- PLAYING → GAME_OVER (collision/fall)