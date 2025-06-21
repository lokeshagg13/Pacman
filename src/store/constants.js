const constants = {
    GAME: {
        TARGET_FPS: 60,
    },
    MAP: {
        ASPECT_RATIO: 1.47,
        SPAWN_SYMBOL: {
            PLAYER_ORIGIN: 'O',
            GHOST_ORIGIN: 'G'
        },
        JAIL_SYMBOL: 'J'
    },
    PLAYER: {
        TYPES: ['user', 'bot'],
        RADIUS_PERC: 0.4,
        VELOCITY_PERC: 0.02 / 8,
        MAX_MOUTH_OPENING: 50 * Math.PI / 180,
        TOTAL_LIVES: 3,
    },
    GHOST: {
        COUNT: 4,
        COLORS: [
            "#FF0000",  // Blinky (Red)
            "#FFC0CB",  // Pinky (Pink)
            "#00FFFF",  // Inky (Cyan)
            "#FF9900"   // Clyde (Orange)
        ],
        VELOCITY_PERC: 0.01 / 8,
        MOVEMENT: {
            SHOW_PROXIMITY: false,
            PROMIXITY_RADIUS_PERC: 0.2,
            RANDOM_STEP_LIMIT: 1000,
            PATH_UPDATE_INTERVAL: 10000 // 10 seconds
        },
    },
}

export default constants;