import constants from "../store/constants";
import Blueprint from "./world/blueprint";
import Map from "./world/map";
import Pellet from "./objects/pellet";
import Ghost from "./objects/ghost";
import Player from "./objects/player";
import PlayerController from "./controllers/playerController";
import GhostController from "./controllers/ghostController";

class Game {
    constructor(canvas, stateHandlers) {
        // Basic Game Config
        this.canvas = canvas;
        this.isOnHold = false;

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
        this.decrementLives = stateHandlers.decrementLives;
    }

    // Create and Resize pellets based on map's cell dimensions
    createAndResizePellets(cellWidth, cellHeight) {
        const pelletRadiusX = 0.08 * cellWidth;
        const pelletRadiusY = 0.08 * cellHeight;

        this.pellets = [];

        this.blueprint.forEach((row, i) => {
            row.forEach((symbol, j) => {
                if (symbol === ".") {
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
        const playerRadiusX = Math.floor(0.4 * cellWidth);
        const playerRadiusY = Math.floor(0.4 * cellHeight);
        const playerVelocityX = constants.PLAYER_VELOCITY_PERC * this.canvas.width;
        const playerVelocityY = constants.PLAYER_VELOCITY_PERC * this.canvas.height;
        const { row, col } = Blueprint.findElementInBlueprint(
            constants.SPAWN_SYMBOL.PLAYER_ORIGIN,
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
        const ghostWidth = Math.floor(0.5 * cellWidth);
        const ghostHeight = Math.floor(0.8 * cellHeight);
        const ghostVelocityX = constants.GHOST_VELOCITY_PERC * this.canvas.width;
        const ghostVelocityY = constants.GHOST_VELOCITY_PERC * this.canvas.height;
        const { row, col } = Blueprint.findElementInBlueprint(
            constants.SPAWN_SYMBOL.GHOST_ORIGIN,
            this.blueprint
        );
        const { x, y } = this.map.getCanvasPositionForArrayIndices({
            position: { row, col },
            offset: { x: 0.5, y: 0.5 }
        });

        this.ghosts = [];

        for (let i = 0; i < constants.GHOST_COUNT; i++) {
            this.ghosts.push(
                new Ghost({
                    position: { x, y },
                    velocity: { x: ghostVelocityX, y: ghostVelocityY },
                    width: ghostWidth,
                    height: ghostHeight,
                    color: constants.GHOST_COLORS[i],
                    promixityRadius: {
                        x: constants.GHOST_MOVEMENT.PROMIXITY_RADIUS_PERC * this.canvas.width,
                        y: constants.GHOST_MOVEMENT.PROMIXITY_RADIUS_PERC * this.canvas.height
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
        this.runJailBarsAnimation();
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
        this.ghosts.forEach(ghost => {
            if (ghost.isCollidingWithPlayer(this.player)) {
                this.isOnHold = true;
                this.player.runDyingAnimation(() => {
                    const gameOn = this.decrementLives();
                    if (gameOn) {
                        this.resetGame();
                        this.isOnHold = false;
                    }
                });
            }
        });
    }

    // Animate Jail Bars
    runJailBarsAnimation() {
        let toggleCount = 0;
        const interval = setInterval(() => {
            const show = toggleCount % 2 === 0;
            this.map.toggleJailBars(show);
            this.draw();

            toggleCount++;
            if (toggleCount === 7) {
                this.map.toggleJailBars(false);
                clearInterval(interval);
            }
        }, 500);
    }

    // Update all the game objects
    updateGameObjects() {
        // When player dies, game is on hold until reset for next round
        if (this.isOnHold) return;

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

        this.map.draw(ctx);
        this.pellets.forEach((pellet) => {
            pellet.draw(ctx);
        });
        this.ghosts.forEach((ghost) => {
            ghost.draw(ctx, {
                showProximity: constants.GHOST_MOVEMENT.SHOW_PROXIMITY
            });
        });
        this.player.draw(ctx);
    }
}

export default Game;