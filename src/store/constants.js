const constants = {
    GAME: {
        TARGET_FPS: 60,
        DIFFICULTY_TYPES: [
            {
                LEVEL: 'easy',
                GHOST_PROMIXITY_RADIUS_PERC: 0.2,   // w.r.t CANVAS width and height
            },
            {
                LEVEL: 'medium',
                GHOST_PROMIXITY_RADIUS_PERC: 0.4,   // w.r.t CANVAS width and height
            },
            {
                LEVEL: 'hard',
                GHOST_PROMIXITY_RADIUS_PERC: 0.75,   // w.r.t CANVAS width and height
            }
        ],
    },
    MAP: {
        RES_HEIGHT: 1180,   // Y axis resolution
        ASPECT_RATIO: 1.47,
        SPAWN_SYMBOL: {
            PLAYER_ORIGIN: 'O',
            GHOST_ORIGIN: 'G'
        },
        EMPTY_SPACE_SYMBOL: '*',
        PELLET_SYMBOL: '.',
        JAIL_BLOCK_SYMBOL: 'J',
        JAIL_BREAK_SYMBOL: 'I',
        DISTANCE_LIMIT: 1 / 6,  // (w.r.t. player radius x) This is the min distance below which a player will be considered to have reached a target position
        DIRECTIONS: ["up", "down", "left", "right"],
        ROW_OFFSET: { up: -1, down: 1, left: 0, right: 0 },
        COL_OFFSET: { up: 0, down: 0, left: -1, right: 1 }
    },
    PELLET: {
        COLOR: 'white',
        RADIUS_PERC: 0.08   // w.r.t CELL width and height
    },
    PLAYER: {
        COLOR: 'yellow',
        TYPES: ['user', 'bot'],
        RADIUS_PERC: 0.4,   // w.r.t CELL width and height
        VISUAL_RADIUS_PERC: 0.8,    // w.r.t PLAYER RADIUS
        VELOCITY_PERC: 0.02 / 8,    // w.r.t CANVAS width and height
        SIMULATOR_VELOCITY_PERC: 0.04 / 8,    // w.r.t CANVAS width and height
        MAX_MOUTH_OPENING: 50 * Math.PI / 180,
        MOUTH_ANIMATION_SPEED: 0.1,    // Rate between 0 and 1
        TOTAL_LIVES: 3,
        AVOID_GHOST_PROXIMITY_CELLS: 2,
    },
    GHOST: {
        COUNT: 4,
        COLORS: [
            "#FF0000",  // Blinky (Red)
            "#FFC0CB",  // Pinky (Pink)
            "#00FFFF",  // Inky (Cyan)
            "#FF9900"   // Clyde (Orange)
        ],
        WIDTH_PERC: 0.5,    // w.r.t CELL width and height
        HEIGHT_PERC: 0.8,   // w.r.t CELL width and height
        EYES: {
            COLOR: "white",
            RADIUS_PERC: 0.2,    // w.r.t GHOST WIDTH ONLY
            OFFSET_PERC: {
                X: 0.2,     // w.r.t GHOST WIDTH ONLY
                Y: 0.3      // w.r.t GHOST HEIGHT ONLY
            },
            PUPILS: {
                COLOR: "black",
                RADIUS_PERC: 0.5,   // w.r.t GHOST EYE RADIUS
            }
        },
        LEGS: {
            COUNT: 3,
            RADIUS_PERC: 1 / 6,  // w.r.t GHOST width and height
        },
        VELOCITY_PERC: 0.01 / 8,    // w.r.t CANVAS width and height
        SIMULATOR_VELOCITY_PERC: 0.04 / 8,    // w.r.t CANVAS width and height
        MOVEMENT: {
            SHOW_PROXIMITY: false,
            RANDOM_STEP_LIMIT: 1000,
            PATH_UPDATE_INTERVAL: 1000 // 10 seconds
        },
    },
    ANIMATIONS: {
        JAIL_BARS_DISAPPEARENCE_COUNT: 3,
        JAIL_BARS_ANIMATION_RATE: 500,    // In milliseconds [200-1000]
        DYING_PLAYER_ANIMATION_RATE: (2.5 * Math.PI) / 180,    // In degrees [1-90]    
    }
}

export default constants;