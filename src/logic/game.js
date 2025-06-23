import constants from "../store/constants";
import Blueprint from "./world/blueprint";
import Map from "./world/map";
import Pellet from "./objects/pellet";
import Ghost from "./objects/ghost";
import Player from "./objects/player";
import PlayerController from "./controllers/playerController";
import GhostController from "./controllers/ghostController";

class Game {
    constructor(canvas, playerType, difficultyLevel, stateHandlers) {
        // Basic Game Config
        this.canvas = canvas;
        this.playerType = playerType;
        this.difficultyLevel = difficultyLevel;
        this.isOnHold = false;
        this.isPlayerFreezed = false;

        // Game Objects
        this.blueprint = Blueprint.fetch();
        this.map = null;
        this.player = null;
        this.ghosts = [];
        this.pellets = [];

        // Game Object Controllers
        this.playerController = new PlayerController(this);
        this.ghostController = new GhostController(this);

        // Score Handling Function
        this.incrementScore = stateHandlers.incrementScore;

        // Lives Handling Function
        this.lives = constants.PLAYER.TOTAL_LIVES; // Local variable
        this.decrementLives = stateHandlers.decrementLives;

        // Audio effects
        this.beginAudio = new Audio(`${process.env.PUBLIC_URL}/audios/begin.mp3`);
        this.jailBreakAudio = new Audio(`${process.env.PUBLIC_URL}/audios/jail-break.mp3`);
        this.dyingAudio = new Audio(`${process.env.PUBLIC_URL}/audios/dying.mp3`);
    }

    // Create and Resize pellets based on map's cell dimensions
    createAndResizePellets(cellWidth, cellHeight) {
        const pelletRadiusX = constants.PELLET.RADIUS_PERC * cellWidth;
        const pelletRadiusY = constants.PELLET.RADIUS_PERC * cellHeight;

        this.pellets = [];

        this.blueprint.forEach((row, i) => {
            row.forEach((symbol, j) => {
                if (symbol === constants.MAP.PELLET_SYMBOL) {
                    const { x, y } = this.map.getCanvasPositionForArrayIndices({
                        position: { row: i, col: j },
                        offset: { x: 0.5, y: 0.5 }
                    });
                    this.pellets.push(
                        new Pellet({
                            position: { x, y },
                            radius: {
                                x: pelletRadiusX, y: pelletRadiusY
                            }
                        })
                    );
                }
            });
        });
    }

    // Spawn and Resize the pacman player based on map's cell dimensions and canvas dimensions
    spawnAndResizePlayer(cellWidth, cellHeight) {
        const playerRadiusX = Math.floor(constants.PLAYER.RADIUS_PERC * cellWidth);
        const playerRadiusY = Math.floor(constants.PLAYER.RADIUS_PERC * cellHeight);
        const playerVelocityX = constants.PLAYER.VELOCITY_PERC * this.canvas.width;
        const playerVelocityY = constants.PLAYER.VELOCITY_PERC * this.canvas.height;
        const { row, col } = Blueprint.findElementInBlueprint(
            constants.MAP.SPAWN_SYMBOL.PLAYER_ORIGIN,
            this.blueprint
        );
        const { x, y } = this.map.getCanvasPositionForArrayIndices({
            position: { row, col },
            offset: { x: 0.5, y: 0.5 }
        });

        this.player = new Player({
            position: { x, y },
            velocity: { x: playerVelocityX, y: playerVelocityY },
            radius: { x: playerRadiusX, y: playerRadiusY }
        });
    }

    // Spawn and Resize the ghosts based on map's cell dimensions and canvas dimensions
    spawnAndResizeGhosts(cellWidth, cellHeight) {
        const ghostWidth = Math.floor(constants.GHOST.WIDTH_PERC * cellWidth);
        const ghostHeight = Math.floor(constants.GHOST.HEIGHT_PERC * cellHeight);
        const ghostVelocityX = constants.GHOST.VELOCITY_PERC * this.canvas.width;
        const ghostVelocityY = constants.GHOST.VELOCITY_PERC * this.canvas.height;
        const proximityRadiusPerc = constants.GAME.DIFFICULTY_TYPES.find((level) => level.LEVEL === this.difficultyLevel).GHOST_PROMIXITY_RADIUS_PERC || 0.2;
        const { row, col } = Blueprint.findElementInBlueprint(
            constants.MAP.SPAWN_SYMBOL.GHOST_ORIGIN,
            this.blueprint
        );
        const { x, y } = this.map.getCanvasPositionForArrayIndices({
            position: { row, col },
            offset: { x: 0.5, y: 0.5 }
        });

        this.ghosts = [];

        for (let i = 0; i < constants.GHOST.COUNT; i++) {
            this.ghosts.push(
                new Ghost({
                    position: { x, y },
                    velocity: { x: ghostVelocityX, y: ghostVelocityY },
                    width: ghostWidth,
                    height: ghostHeight,
                    color: constants.GHOST.COLORS[i],
                    promixityRadius: {
                        x: proximityRadiusPerc * this.canvas.width,
                        y: proximityRadiusPerc * this.canvas.height
                    }
                })
            );
        }
    }

    // Generate and Resize all game objects
    generateAndResizeGameObjects() {
        const cellWidth = Math.floor(this.canvas.width / this.blueprint[0].length);
        const cellHeight = Math.floor(this.canvas.height / this.blueprint.length);

        this.map = new Map({
            blueprint: this.blueprint,
            cellWidth: cellWidth,
            cellHeight: cellHeight,
        });
        this.createAndResizePellets(cellWidth, cellHeight);
        this.spawnAndResizePlayer(cellWidth, cellHeight);
        this.spawnAndResizeGhosts(cellWidth, cellHeight);
    }

    // Reset game after player dies and lives are remaining
    resetGame() {
        this.spawnAndResizePlayer(this.map.cellWidth, this.map.cellHeight);
        this.spawnAndResizeGhosts(this.map.cellWidth, this.map.cellHeight);
        this.playerController = new PlayerController(this);
        this.ghostController = new GhostController(this);
        this.runJailBarsAnimation(true);
    }

    // Checks and removes any pellets that collide with the player
    checkPelletsCollision() {
        this.pellets = this.pellets.filter(pellet => {
            if (pellet.isCollidingWithPlayer(this.player)) {
                this.incrementScore();
                return false;
            }
            return true;
        });
    }

    // Checks for ghost colliding with the player
    checkGhostsCollision() {
        let collisionDetected = false;

        this.ghosts.forEach(ghost => {
            if (!collisionDetected && ghost.isCollidingWithPlayer(this.player)) {
                collisionDetected = true;
                this.isOnHold = true;
                this.dyingAudio.play();
                this.player.runDyingAnimation(() => {
                    this.lives -= 1;
                    this.decrementLives();
                    if (this.lives > 0) {
                        this.resetGame();
                        this.isOnHold = false;
                    }
                });
            }
        });
    }

    // Animate Jail Bars
    runJailBarsAnimation(reset = false) {
        let toggleCount = 0;
        this.isPlayerFreezed = true;
        const interval = setInterval(() => {
            const show = toggleCount % 2 !== 0;
            this.map.toggleJailBars(show);
            this.draw();
            toggleCount++;
            const maxCheck = 2 * constants.ANIMATIONS.JAIL_BARS_DISAPPEARENCE_COUNT + 1;
            if (toggleCount === maxCheck) {
                this.map.toggleJailBars(false, true);
                this.isPlayerFreezed = false;
                clearInterval(interval);
            } else {
                if (reset && !show) this.jailBreakAudio.play();
            }
        }, constants.ANIMATIONS.JAIL_BARS_ANIMATION_RATE);
    }

    // Update all the game objects
    updateGameObjects() {
        // When player dies, game is on hold until reset for next round
        if (this.isOnHold) return;

        if (!this.isPlayerFreezed) {
            this.player.updateMouthAnimation();
            this.playerController.update();
        }
        this.ghostController.update();
        this.checkPelletsCollision();
        this.checkGhostsCollision();
    }

    // Draw all the game objects
    draw() {
        const ctx = this.canvas.getContext("2d");
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.map.draw(ctx);
        this.pellets.forEach((pellet) => {
            pellet.draw(ctx);
        });
        this.ghosts.forEach((ghost) => {
            ghost.draw(ctx, {
                showProximity: constants.GHOST.MOVEMENT.SHOW_PROXIMITY
            });
        });
        this.player.draw(ctx);
    }

    // Clear game
    clear() {
        const ctx = this.canvas.getContext("2d");
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

export default Game;