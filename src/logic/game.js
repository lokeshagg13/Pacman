import constants from "../store/constants";
import Blueprint from "./world/blueprint";
import Map from "./world/map";
import Pellet from "./objects/pellet";
import Ghost from "./objects/ghost";
import Player from "./objects/player";
import PlayerController from "./controllers/playerController";

class Game {
    constructor(canvas, stateHandlers) {
        // Basic Game Config
        this.canvas = canvas;

        // Game Objects
        this.blueprint = Blueprint.fetch();
        this.map = null;
        this.player = null;
        this.ghosts = [];
        this.pellets = [];

        // Game Object Controllers
        this.playerController = new PlayerController(this);

        // Score Handling Functions
        this.incrementScore = stateHandlers.incrementScore;
    }

    // Create and Resize pellets 
    createAndResizePellets(cellWidth, cellHeight) {
        const pelletRadiusX = 0.08 * cellWidth;
        const pelletRadiusY = 0.08 * cellHeight;

        this.pellets = [];

        this.blueprint.forEach((row, i) => {
            row.forEach((symbol, j) => {
                if (symbol === ".") {
                    const x = cellWidth * (0.5 + j);
                    const y = cellHeight * (0.5 + i);
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

        this.player = new Player({
            position: { x: cellWidth * (col + 0.5), y: cellHeight * (row + 0.5) },
            velocity: { x: playerVelocityX, y: playerVelocityY },
            radius: { x: playerRadiusX, y: playerRadiusY }
        });
    }

    // Spawn and Resize the ghosts based on map's cell dimensions and canvas dimensions
    spawnAndResizeGhosts(cellWidth, cellHeight) {
        const ghostWidth = Math.floor(0.5 * cellWidth);
        const ghostHeight = Math.floor(0.5 * cellHeight);
        const ghostVelocityX = constants.GHOST_VELOCITY_PERC * this.canvas.width;
        const ghostVelocityY = constants.GHOST_VELOCITY_PERC * this.canvas.height;
        const { row, col } = Blueprint.findElementInBlueprint(
            constants.SPAWN_SYMBOL.GHOST_ORIGIN,
            this.blueprint
        );

        this.ghosts = [];

        this.ghosts.push(
            new Ghost({
                position: {
                    x: cellWidth * col + (cellWidth - ghostWidth) * 0.5, y: cellHeight * row + (cellHeight - ghostHeight) * 0.5
                },
                velocity: { x: ghostVelocityX, y: ghostVelocityY },
                width: ghostWidth,
                height: ghostHeight
            })
        );
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

    // Update all the game objects
    updateGameObjects() {
        this.playerController.update();
        this.checkPelletsCollision();
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
            ghost.draw(ctx)
        });
        this.player.draw(ctx);
    }
}

export default Game;