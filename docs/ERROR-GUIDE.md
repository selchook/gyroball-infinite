# Gyroball Game - Error Reference Guide
**Three.js r168 | CrazyGames | Capacitor | Vercel**

---

## 1. npm install / Vite build errors

### `Module not found: 'three'`
```bash
npm install three@0.168.0 --save
```

### `Cannot resolve @capacitor/core`
```bash
npm install @capacitor/core @capacitor/cli --save-dev
```

### Vite build fails with ES modules
```js
// vite.config.js
export default {
  build: {
    target: 'es2020',
    rollupOptions: {
      external: ['capacitor']
    }
  }
}
```

### `TypeError: Failed to resolve module specifier`
```js
// Use full imports in main.js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
```

---

## 2. Three.js r168 engine errors

### `THREE is not defined`
```js
// ❌ Wrong
import THREE from 'three';

// ✅ Correct
import * as THREE from 'three';
```

### `WebGLRenderer: Error creating WebGL context`
```js
const renderer = new THREE.WebGLRenderer({ 
  antialias: window.devicePixelRatio < 2,
  powerPreference: "high-performance",
  failIfMajorPerformanceCaveat: false
});

// Fallback for old devices
if (!renderer.getContext()) {
  document.body.innerHTML = '<p>WebGL not supported</p>';
}
```

### `BufferGeometry.attributes` deprecation
```js
// ❌ Old r168 might warn
geometry.addAttribute('position', positionAttribute);

// ✅ Correct
geometry.setAttribute('position', positionAttribute);
```

### Physics body falls through floor
```js
// Ensure collision detection
const floorBody = new CANNON.Body({
  mass: 0,
  shape: new CANNON.Plane(),
  material: new CANNON.Material({ friction: 0.3 })
});
world.addBody(floorBody);
```

---

## 3. CrazyGames SDK errors

### SDK fails to initialize
```js
// Check environment first
if (typeof window.CrazyGames !== 'undefined') {
  window.CrazyGames.SDK.init(() => {
    console.log('CrazyGames SDK ready');
    startGame();
  });
} else {
  console.warn('CrazyGames SDK not available');
  startGame(); // Continue without SDK
}
```

### Ad errors (GDPR, no fill)
```js
function showAd() {
  if (!window.CrazyGames) return;
  
  window.CrazyGames.SDK.ad.requestAd('rewarded', {
    adFinished: () => resumeGame(),
    adError: (error) => {
      console.log('Ad error:', error);
      resumeGame(); // Don't block gameplay
    }
  });
}
```

### `gameplayStart()` not called
```js
// Call on first user interaction
document.addEventListener('click', () => {
  if (window.CrazyGames) {
    window.CrazyGames.SDK.game.gameplayStart();
  }
}, { once: true });
```

---

## 4. Canvas/WebGL context errors

### `WebGL context lost`
```js
renderer.domElement.addEventListener('webglcontextlost', (event) => {
  event.preventDefault();
  console.log('WebGL context lost');
});

renderer.domElement.addEventListener('webglcontextrestored', () => {
  console.log('WebGL context restored');
  initTextures(); // Reload resources
});
```

### Canvas not responsive
```css
canvas {
  width: 100%;
  height: 100vh;
  display: block;
  touch-action: none;