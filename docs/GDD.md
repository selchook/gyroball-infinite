# **GYROBALL INFINITE** - Game Design Document

## 1. Concept & Hook (web-first, instant engagement)

**Gyroball Infinite** is a 3D physics-based maze navigation game where players control a metallic ball through increasingly complex rotating tube environments. The core hook is the satisfying momentum-based physics combined with the visual spectacle of navigating through spinning, neon-lit cylindrical mazes.

**30-Second Pitch:** Roll, boost, and survive through infinite rotating tubes filled with obstacles. One wrong move sends you plummeting into the void. How far can you roll?

**Key Differentiators:**
- Seamless 360° tube rotation creates unique spatial challenges
- Momentum-based physics reward skillful speed management
- Infinite procedural generation ensures endless replayability
- Instant restart keeps players in flow state

## 2. Core Loop (sessions 2-10 min, replayable)

### Primary Loop (30-60 seconds):
1. **Start** - Ball spawns at tube entrance with forward momentum
2. **Navigate** - Player controls ball through rotating tube segment
3. **Overcome Obstacles** - Dodge barriers, gaps, and moving hazards
4. **Reach Checkpoint** - Complete tube segment, score increases
5. **Repeat** with increased difficulty OR **Fail** and restart instantly

### Secondary Loop (2-10 minutes):
- Chain multiple tube segments together
- Unlock new visual themes and ball types
- Chase personal best distances and leaderboard positions
- Master advanced techniques (wall-riding, boost timing)

### Meta Loop (multiple sessions):
- Progressive difficulty mastery
- Completionist achievements
- Social sharing of epic runs

## 3. Mechanics (keyboard+mouse+touch controls)

### Core Physics:
- **Momentum System**: Ball maintains realistic physics with gravity, friction, and bounce
- **Tube Rotation**: Environment rotates around the ball's forward path
- **Wall Contact**: Ball can roll on any surface of the cylindrical tube

### Control Scheme:

**Desktop (Keyboard):**
- `A/D` or `←/→`: Apply lateral force (move left/right around tube circumference)
- `W/S` or `↑/↓`: Speed boost/brake
- `SPACE`: Emergency brake/precise control mode
- `R`: Instant restart

**Desktop (Mouse):**
- Mouse movement: Intuitive directional control
- Left click: Boost
- Right click: Brake

**Mobile (Touch):**
- Drag finger: Move ball direction
- Tap and hold: Boost
- Double tap: Brake
- Swipe up: Restart

### Advanced Mechanics:
- **Wall Riding**: Maintain speed by riding tube walls at angles
- **Boost Management**: Limited boost energy that regenerates over time
- **Momentum Conservation**: Skilled players can maintain speed through complex sections

## 4. Levels & Progression (clear goals per session)

### Infinite Procedural Generation:
- **Segment Length**: Each tube segment is 100-200 units long
- **Difficulty Scaling**: Obstacles become more frequent and complex every 5 segments
- **Variety System**: 12 different obstacle types rotate to maintain freshness

### Obstacle Types:
1. **Static Barriers**: Walls requiring navigation around
2. **Moving Pistons**: Timed hazards that extend/retract
3. **Rotating Blades**: Spinning obstacles requiring timing
4. **Gap Jumps**: Sections with missing tube floor
5. **Narrow Passages**: Precision-requiring tight spaces
6. **Speed Zones**: Areas that force rapid movement
7. **Split Paths**: Multiple route choices
8. **Spiral Sections**: Corkscrew tube geometry
9. **Pendulum Hammers**: Large swinging obstacles
10. **Conveyor Rings**: Sections that alter ball movement
11. **Portal Gates**: Teleportation challenges
12. **Gravity Wells**: Areas with altered physics

### Difficulty Progression:
- **Segments 1-5**: Basic obstacles, generous spacing
- **Segments 6-15**: Combination obstacles, moderate timing
- **Segments 16-25**: Complex patterns, precise timing required
- **Segments 26+**: Maximum difficulty with rapid obstacle sequences

### Session Goals:
- **