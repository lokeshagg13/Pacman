import gameConfig from "./gameConfig";
import Blueprint from "./world/blueprint";
import Map from "./world/map";
import Pellet from "./objects/pellet";
import Ghost from "./objects/ghost";
import GhostController from "./controllers/ghostController";
import HumanPlayer from "./objects/players/humanPlayer";
import HumanPlayerController from "./controllers/playerControllers/humanPlayerController";
import BotPlayer from "./objects/players/botPlayer";
import BotPlayerController from "./controllers/playerControllers/botPlayerController";

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
        if (playerType === 'user') {
            this.playerController = new HumanPlayerController(this);
        } else {
            this.playerController = new BotPlayerController(this, false);
        }
        this.ghostController = new GhostController(this);

        // Score Handling Function
        this.incrementScore = stateHandlers.incrementScore;

        // Lives Handling Function
        this.lives = gameConfig.PLAYER.TOTAL_LIVES; // Local variable
        this.decrementLives = stateHandlers.decrementLives;

        // Winner Handling Function
        this.declareWinner = stateHandlers.declareWinner;

        // Audio effects
        this.beginAudio = new Audio(`${process.env.PUBLIC_URL}/audios/begin.mp3`);
        this.jailBreakAudio = new Audio(`${process.env.PUBLIC_URL}/audios/jail-break.mp3`);
        this.dyingAudio = new Audio(`${process.env.PUBLIC_URL}/audios/dying.mp3`);
    }

    // Create and Resize pellets based on map's cell dimensions
    createAndResizePellets(cellWidth, cellHeight) {
        const pelletRadiusX = gameConfig.PELLET.RADIUS_PERC * cellWidth;
        const pelletRadiusY = gameConfig.PELLET.RADIUS_PERC * cellHeight;

        this.pellets = [];

        this.blueprint.forEach((row, i) => {
            row.forEach((symbol, j) => {
                if (symbol === gameConfig.MAP.PELLET_SYMBOL) {
                    const { x, y } = this.map.getCanvasPositionForArrayIndices({
                        position: { row: i, col: j },
                        offset: { x: 0.5, y: 0.5 }
                    });
                    this.pellets.push(
                        new Pellet({
                            position: { x, y },
                            indices: { row: i, col: j },
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
        const playerRadiusX = Math.floor(gameConfig.PLAYER.RADIUS_PERC * cellWidth);
        const playerRadiusY = Math.floor(gameConfig.PLAYER.RADIUS_PERC * cellHeight);
        const playerVelocityX = gameConfig.PLAYER.VELOCITY_PERC * this.canvas.width;
        const playerVelocityY = gameConfig.PLAYER.VELOCITY_PERC * this.canvas.height;
        const { row, col } = Blueprint.findElementInBlueprint(
            gameConfig.MAP.SPAWN_SYMBOL.PLAYER_ORIGIN,
            this.blueprint
        );
        const { x, y } = this.map.getCanvasPositionForArrayIndices({
            position: { row, col },
            offset: { x: 0.5, y: 0.5 }
        });

        if (this.playerType === "user") {
            this.player = new HumanPlayer({
                position: { x, y },
                indices: { row, col },
                velocity: { x: playerVelocityX, y: playerVelocityY },
                radius: { x: playerRadiusX, y: playerRadiusY }
            });
        } else {
            this.player = new BotPlayer({
                position: { x, y },
                indices: { row, col },
                velocity: { x: playerVelocityX, y: playerVelocityY },
                radius: { x: playerRadiusX, y: playerRadiusY }
            });
        }
    }

    // Spawn and Resize the ghosts based on map's cell dimensions and canvas dimensions
    spawnAndResizeGhosts(cellWidth, cellHeight) {
        const ghostWidth = Math.floor(gameConfig.GHOST.WIDTH_PERC * cellWidth);
        const ghostHeight = Math.floor(gameConfig.GHOST.HEIGHT_PERC * cellHeight);
        const ghostVelocityX = gameConfig.GHOST.VELOCITY_PERC * this.canvas.width;
        const ghostVelocityY = gameConfig.GHOST.VELOCITY_PERC * this.canvas.height;
        const proximityRadiusPerc = gameConfig.GAME.DIFFICULTY_TYPES.find((level) => level.LEVEL === this.difficultyLevel).GHOST_PROMIXITY_RADIUS_PERC || 0.2;
        const { row, col } = Blueprint.findElementInBlueprint(
            gameConfig.MAP.SPAWN_SYMBOL.GHOST_ORIGIN,
            this.blueprint
        );
        const { x, y } = this.map.getCanvasPositionForArrayIndices({
            position: { row, col },
            offset: { x: 0.5, y: 0.5 }
        });

        this.ghosts = [];

        for (let i = 0; i < gameConfig.GHOST.COUNT; i++) {
            this.ghosts.push(
                new Ghost({
                    position: { x, y },
                    indices: { row, col },
                    velocity: { x: ghostVelocityX, y: ghostVelocityY },
                    width: ghostWidth,
                    height: ghostHeight,
                    color: gameConfig.GHOST.COLORS[i],
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
        if (this.playerType === "user") {
            this.playerController = new HumanPlayerController(this);
        } else {
            this.playerController = new BotPlayerController(this, false);
        }
        this.ghostController = new GhostController(this);
        this.runJailBarsAnimation(true);
    }

    // Checks and removes any pellets that collide with the player
    checkPelletsCollision() {
        if (this.pellets.length === 0) {
            this.declareWinner(true);
            return;
        }
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
            const maxCheck = 2 * gameConfig.ANIMATIONS.JAIL_BARS_DISAPPEARENCE_COUNT + 1;
            if (toggleCount === maxCheck) {
                this.map.toggleJailBars(false, true);
                this.isPlayerFreezed = false;
                clearInterval(interval);
            } else {
                if (reset && !show) this.jailBreakAudio.play();
            }
        }, gameConfig.ANIMATIONS.JAIL_BARS_ANIMATION_RATE);
    }

    // Update all the game objects
    updateGameObjects() {
        // When player dies, game is on hold until reset for next round
        if (this.isOnHold || this.isPlayerFreezed) return;

        if (this.playerType === "user") {
            this.map.updateMovableGrid({ applyGhostBlockage: false });
        } else {
            this.map.updateMovableGrid({ applyGhostBlockage: true, ghosts: this.ghosts, player: this.player });
        }

        this.player.updateMouthAnimation();
        this.playerController.update();
        this.ghostController.update();
        this.checkPelletsCollision();
        this.checkGhostsCollision();
    }

    // Draw all the game objects
    draw() {
        const ctx = this.canvas.getContext("2d");
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.map.draw(ctx, {
            showGhostProximityGrid: this.playerType === "bot" && gameConfig.GHOST.MOVEMENT.SHOW_PROXIMITY_GRID
        });
        this.pellets.forEach((pellet) => {
            pellet.draw(ctx);
        });
        this.ghosts.forEach((ghost) => {
            ghost.draw(ctx, {
                showGhostProximityCircle: gameConfig.GHOST.MOVEMENT.SHOW_PROXIMITY_CIRCLE
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