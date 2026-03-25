# CrazyGames Submission Guide for Gyroball Infinite

## 1. Account Setup

1. **Create Developer Account**
   - Visit [CrazyGames Developer Portal](https://developer.crazygames.com)
   - Sign up with professional email address
   - Complete profile with studio information
   - Add payment details for revenue sharing

2. **Account Verification**
   - Verify email address immediately
   - Upload developer documentation if required
   - Set up two-factor authentication for security

## 2. Pre-submission Checklist (All Technical Requirements)

### Core Technical Requirements
- ✅ **WebGL Build**: Ensure Three.js r168 build is optimized for web
- ✅ **HTTPS Compatible**: All assets must load over HTTPS
- ✅ **Mobile Responsive**: Touch controls for mobile/tablet devices
- ✅ **Performance**: Maintain 60fps on mid-range devices
- ✅ **No External Dependencies**: Self-contained game files only
- ✅ **Audio Management**: Mute/unmute functionality required
- ✅ **Fullscreen Support**: Implement fullscreen toggle
- ✅ **Loading Screen**: Professional loading screen with progress bar

### Browser Compatibility
- Test on Chrome, Firefox, Safari, Edge
- Ensure WebGL compatibility across browsers
- Verify mobile Safari and Chrome mobile performance

## 3. SDK Integration Verification Steps

### CrazyGames SDK Integration
1. **Install SDK**
   ```javascript
   import { CrazyGames } from '@crazygames/sdk';
   ```

2. **Initialize SDK**
   ```javascript
   await CrazyGames.init();
   CrazyGames.requestGameplayStart();
   ```

3. **Required SDK Implementations**
   - `happytime()` - Call during engaging gameplay moments
   - `gameplayStart()` - Call when level/game begins
   - `gameplayStop()` - Call during menus/pauses
   - Ad break integration for rewarded content
   - User account system integration (optional but recommended)

4. **Test SDK Events**
   - Verify all SDK calls work in development
   - Test ad integration thoroughly
   - Ensure SDK doesn't break game flow

## 4. Bundle Size Optimization (Target ≤20MB Initial)

### Asset Optimization
- **Textures**: Use compressed formats (WebP, optimized PNG)
- **3D Models**: Optimize geometry, reduce polygon count
- **Audio**: Compress to OGG/MP3, remove unused audio files
- **Code**: Minify Three.js build, remove debug code

### Loading Strategy
- Implement progressive loading for larger assets
- Load core gameplay assets first (≤5MB)
- Stream additional content during gameplay
- Use texture atlasing to reduce HTTP requests

## 5. Game Cover Images Required

### Image Specifications
- **Thumbnail**: 280x280px PNG
- **Banner**: 1900x1200px PNG
- **Icon**: 512x512px PNG (square format)

### Design Guidelines
- Show actual gameplay from Gyroball Infinite
- Include game title prominently
- Use vibrant colors that stand out
- Avoid text-heavy designs
- Ensure images look good at different sizes

## 6. Categories & Tags Selection

### Primary Category
- **Skill** or **Action**

### Relevant Tags
- 3D
- Physics
- Maze
- Ball Games
- Puzzle
- Arcade
- WebGL
- Single Player
- Endless

### SEO Considerations
- Research competing gyroball/maze games
- Include trending gaming keywords
- Keep tags relevant to actual gameplay

## 7. Basic Launch Submission Steps

1. **Upload Game Build**
   - Zip all game files maintaining folder structure
   - Ensure index.html is in root directory
   - Upload through developer portal

2. **Fill Game Information**
   - Title: "Gyroball Infinite"
   - Description: Focus on physics-based maze navigation
   - Screenshots: 5-8 high-quality gameplay screenshots
   - Select appropriate category and tags

3. **Technical Settings**
   - Set recommended resolution
   - Configure fullscreen options
   - Set orientation (landscape/portrait/both)

4. **Submit for Review**