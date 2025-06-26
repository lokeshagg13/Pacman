# Pacman Game Constants Reference

This document explains all the constants used in the Pacman game, categorized by their purpose and usage.

## 1. Game Settings

### **TARGET_FPS**

- **Description:** The target frames per second for the game rendering.
- **Value:** `60`
- **Purpose:** Ensures smooth gameplay by maintaining a consistent frame rate.

### **DIFFICULTY_TYPES**

- **Description:** Defines different difficulty levels for the game.
- **Structure:** Array of objects with `LEVEL` and `GHOST_PROMIXITY_RADIUS_PERC`.

  - **LEVEL:** Difficulty label (`easy`, `medium`, `hard`).
  - **GHOST_PROMIXITY_RADIUS_PERC:** Ghost proximity radius as a percentage of the canvas dimensions.
  - **Values:**

    - Easy: `0.2`
    - Medium: `0.4`
    - Hard: `0.75`

## 2. Map Settings

### **RES_HEIGHT**

- **Description:** Vertical resolution of the map.
- **Value:** `1180`

### **ASPECT_RATIO**

- **Description:** Aspect ratio of the map.
- **Value:** `1.47`

### **SPAWN_SYMBOL**

- **PLAYER_ORIGIN:** Symbol representing the player's starting position (`'O'`).
- **GHOST_ORIGIN:** Symbol representing the ghosts' starting positions (`'G'`).

### **EMPTY_SPACE_SYMBOL**

- **Description:** Symbol representing empty spaces in the map.
- **Value:** `'*'`

### **PELLET_SYMBOL**

- **Description:** Symbol representing pellets on the map.
- **Value:** `'.'`

### **JAIL_BLOCK_SYMBOL**

- **Description:** Symbol representing the jail blocks on the map.
- **Value:** `'J'`

### **JAIL_BREAK_SYMBOL**

- **Description:** Symbol for breaking out of jail blocks.
- **Value:** `'I'`

### **CELL_MOBILITY_STATES**

- **MOVABLE:** `0` (Cells the player can move into).
- **BLOCKED:** `1` (Cells the player cannot move into).
- **GHOST_PROXIMITY:** `2` (Cells within the ghost's proximity grid).

### **DISTANCE_LIMIT**

- **Description:** Minimum distance to consider a player as having reached a target.
- **Value:** `1 / 6` (relative to player radius).

### **DIRECTIONS**

- **Description:** Possible movement directions.
- **Values:** `['up', 'down', 'left', 'right']`

### **ROW_OFFSET / COL_OFFSET**

- **Description:** Offsets for movement directions.

  - `ROW_OFFSET`: `{ up: -1, down: 1, left: 0, right: 0 }`
  - `COL_OFFSET`: `{ up: 0, down: 0, left: -1, right: 1 }`

## 3. Pellet Settings

### **COLOR**

- **Description:** Color of the pellets.
- **Value:** `'white'`

### **RADIUS_PERC**

- **Description:** Radius of the pellets relative to cell width and height.
- **Value:** `0.08`

## 4. Player Settings

### **COLOR**

- **Description:** Color of the player.
- **Value:** `'yellow'`

### **TYPES**

- **Description:** Player types.
- **Values:** `['user', 'bot']`

### **RADIUS_PERC**

- **Description:** Player radius relative to cell width and height.
- **Value:** `0.4`

### **VISUAL_RADIUS_PERC**

- **Description:** Visual radius relative to the player radius.
- **Value:** `0.8`

### **VELOCITY_PERC**

- **Description:** Player movement velocity.
- **Value:** `0.02 / 8` (relative to canvas dimensions).

### **SIMULATOR_VELOCITY_PERC**

- **Description:** Velocity for the simulator.
- **Value:** `0.04 / 8`

### **MAX_MOUTH_OPENING**

- **Description:** Maximum angle for the player's mouth opening animation.
- **Value:** `50 * Math.PI / 180`

### **MOUTH_ANIMATION_SPEED**

- **Description:** Speed of mouth opening/closing animation.
- **Value:** `0.1` (Rate between 0 and 1).

### **TOTAL_LIVES**

- **Description:** Number of lives the player has.
- **Value:** `3`

### **AVOID_GHOST_PROXIMITY_CELLS**

- **Description:** Number of cells to avoid around ghosts.
- **Value:** `2`

## 5. Ghost Settings

### **COUNT**

- **Description:** Number of ghosts in the game.
- **Value:** `4`

### **COLORS**

- **Description:** Colors assigned to ghosts.
- **Values:**

  - Blinky: `'#FF0000'`
  - Pinky: `'#FFC0CB'`
  - Inky: `'#00FFFF'`
  - Clyde: `'#FF9900'`

### **WIDTH_PERC / HEIGHT_PERC**

- **Description:** Dimensions of the ghost relative to cell dimensions.

  - **Width:** `0.5`
  - **Height:** `0.8`

### **EYES**

- **COLOR:** White.
- **RADIUS_PERC:** `0.2` (relative to ghost width).
- **OFFSET_PERC:** Position of the eyes.

  - X: `0.2` (relative to ghost width).
  - Y: `0.3` (relative to ghost height).

- **PUPILS:**

  - COLOR: Black.
  - RADIUS_PERC: `0.5` (relative to eye radius).

### **LEGS**

- **COUNT:** `3`
- **RADIUS_PERC:** `1 / 6` (relative to ghost dimensions).

### **VELOCITY_PERC**

- **Description:** Movement velocity of the ghosts.
- **Value:** `0.01 / 8`

### **SIMULATOR_VELOCITY_PERC**

- **Description:** Velocity for simulator mode.
- **Value:** `0.04 / 8`

### **MOVEMENT**

- **SHOW_PROXIMITY_CIRCLE:** `false` (Displays a circle to detect players - A Ghost proximity circle is useful for a ghost itself to identify where a player is within its proximity circle. This also controls the game's difficulty level where the higher the difficulty level, the higher is the proximity radius).
- **SHOW_PROXIMITY_GRID:** `false` (Shows cells within ghost proximity grid - A Ghost proximity grid is useful for a bot player to identify where it is within the proximity of any ghost. This is useful for making all the cells of the map that are within this proximity grid as immovable for the bot player).
- **RANDOM_STEP_LIMIT:** `1000`
- **PATH_UPDATE_INTERVAL:** `1000` (10 seconds).

## 6. Animation Settings

### **JAIL_BARS_DISAPPEARENCE_COUNT**

- **Description:** Number of hits needed to make jail bars disappear.
- **Value:** `3`

### **JAIL_BARS_ANIMATION_RATE**

- **Description:** Rate of jail bars animation.
- **Value:** `500ms`

### **DYING_PLAYER_ANIMATION_RATE**

- **Description:** Speed of the player's dying animation.
- **Value:** `(2.5 * Math.PI) / 180` (in degrees).
