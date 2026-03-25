# **GYROBALL INFINITE** - Implementation Specification

## 1. File Map

```
src/
├── main.js                           // Entry point, initializes Game class
├── core/
│   ├── Game.js                      // Main game loop, state management, scene coordination
│   ├── SceneManager.js              // Handles scene transitions and lifecycle
│   ├── InputManager.js              // Unified input handling for keyboard/touch/mouse
│   └── AudioManager.js              // Web Audio API synth engine and spatial audio
├── entities/
│   ├── Player.js                    // Metal ball physics, movement, collision bounds
│   ├── TubeSegment.js               // Individual tube section with neon materials
│   ├── Obstacle.js                  // Rotating barriers, moving spikes, crushers
│   └── PowerUp.js                   // Speed boost, shield, checkpoint items
├── systems/
│   ├── PhysicsSystem.js             // Gravity, momentum, collision detection/response
│   ├── TubeGenerator.js             // Procedural infinite tube creation with difficulty scaling
│   ├── EffectsSystem.js             // Particle trails, explosion effects, screen shake
│   └── CameraController.js          // Third-person follow cam with smooth transitions
├── materials/
│   ├── NeonMaterial.js              // Glowing tube walls with animated emission
│   ├── MetalBallMaterial.js         // Reflective player sphere with environment mapping
│   └── ParticleMaterial.js          // Trail and explosion particle shaders
└── scenes/
    ├── BootScene.js                 // Asset preloading, WebGL context setup
    ├── MenuScene.js                 // Title screen, high scores, options
    ├── GameScene.js                 // Main gameplay loop and 3D world
    └── GameOverScene.js             // Score display, restart/menu options
```

## 2. Scene Lifecycle

```
BOOT (BootScene.js):
├── Initialize Three.js renderer, scene, camera
├── Preload procedural textures and audio samples
├── Setup WebGL extensions and performance monitoring
└── Transition → MENU (2s fade)

MENU (MenuScene.js):
├── Render rotating tube preview with neon effects
├── Handle start button, settings, leaderboard
├── Background ambient audio loop
└── Transition → PLAYING (button press)

PLAYING (GameScene.js):
├── Spawn Player at tube start position
├── Begin TubeGenerator infinite creation
├── Start PhysicsSystem tick loop
├── Activate InputManager for ball control
└── Transitions → PAUSED (ESC) | GAME_OVER (collision)

PAUSED (GameScene.js overlay):
├── Freeze all physics and audio
├── Show resume/restart/quit options
└── Transition → PLAYING (resume) | MENU (quit)

GAME_OVER (GameOverScene.js):
├── Display final score and distance traveled
├── Save high score to localStorage
├── Show restart/menu buttons with score animation
└── Transition → PLAYING (restart) | MENU (main menu)
```

## 3. Entities & Classes

### Core Classes
```javascript
class Game {
  properties: { currentState, sceneManager, inputManager, audioManager, renderer, clock }
  methods: { init(), update(), render(), setState(), handleResize() }
}

class SceneManager {
  properties: { scenes, activeScene, transitionTime, fadeOverlay }
  methods: { loadScene(), transitionTo(), update(), getCurrentScene() }
}

class InputManager {
  properties: { keys, touches, mousePos, gyroscope, inputBuffer }
  methods: { update(), isPressed(), getTouchDelta(), getGyroTilt() }
}

class AudioManager {
  properties: { audioContext, synthNodes, spatialNodes, masterGain }
  methods: { playSound(), createSynth(), setListenerPosition(), fadeVolume() }
}
```

### Entity Classes
```javascript
class Player {
  properties: { 
    position: Vector3, velocity: Vector