const constants = {
    TARGET_FPS: 60,
    BOUNDARY_WIDTH_PERC: 1 / 20,
    BOUNDARY_HEIGHT_PERC: 1 / 20,
    PLAYER_RADIUS_PERC: 0.5 / 20,
    PLAYER_VELOCITY_PERC: 0.01 / 8,
    GHOST_VELOCITY_PERC: 0.01 / 8,
    GHOST_COUNT: 4,
    GHOST_COLORS: [
        "#FF0000",  // Blinky (Red)
        "#FFC0CB",  // Pinky (Pink)
        "#00FFFF",  // Inky (Cyan)
        "#FF9900"   // Clyde (Orange)
    ],
    GHOST_MOVEMENT: {
        SHOW_PROXIMITY: false,
        PROMIXITY_RADIUS_PERC: 0.2,
        RANDOM_STEP_LIMIT: 1000,
        PATH_UPDATE_INTERVAL: 10000 // 10 seconds
    },
    SPAWN_SYMBOL: {
        PLAYER_ORIGIN: 'O',
        GHOST_ORIGIN: 'G'
    }
}

export default constants;