import constants from "../store/constants";
import Blueprint from "./world/blueprint";
import Map from "./world/map";
import Ghost from "./objects/ghost";
import Player from "./objects/player";
import PlayerController from "./controllers/PlayerController";

class Game {
    constructor(canvas, stateHandlers) {
        // Basic Game Config
        this.canvas = canvas;

        // Game Objects
        this.blueprint = Blueprint.fetch();
        this.map = null;
        this.player = null;
        this.ghosts = [];

        // Game Object Controllers
        this.playerController = new PlayerController(this);

        // Score Handling Functions
        this.incrementScore = stateHandlers.incrementScore;
    }

    // Resizing the pacman player based on map's cell dimensions and canvas dimensions
    spawnAndResizePlayer(cellWidth, cellHeight) {
        const playerRadiusX = Math.floor(0.4 * cellWidth);
        const playerRadiusY = Math.floor(0.4 * cellHeight);
        const playerVelocityX = constants.PLAYER_VELOCITY_PERC * this.canvas.width;
        const playerVelocityY = constants.PLAYER_VELOCITY_PERC * this.canvas.height;
        const { row, col } = Blueprint.findElementInBlueprint(
            constants.SPAWN_SYMBOL.PLAYER_ORIGIN,
            this.blueprint
        );

        return new Player({
            position: { x: cellWidth * (col + 0.5), y: cellHeight * (row + 0.5) },
            velocity: { x: playerVelocityX, y: playerVelocityY },
            radius: { x: playerRadiusX, y: playerRadiusY }
        })
    }

    // Resizing the ghost based on map's cell dimensions and canvas dimensions
    spawnAndResizeGhost(cellWidth, cellHeight) {
        const ghostWidth = Math.floor(0.5 * cellWidth);
        const ghostHeight = Math.floor(0.5 * cellHeight);
        const ghostVelocityX = constants.GHOST_VELOCITY_PERC * this.canvas.width;
        const ghostVelocityY = constants.GHOST_VELOCITY_PERC * this.canvas.height;

        const { row, col } = Blueprint.findElementInBlueprint(
            constants.SPAWN_SYMBOL.GHOST_ORIGIN,
            this.blueprint
        );

        return new Ghost({
            position: {
                x: cellWidth * col + (cellWidth - ghostWidth) * 0.5, y: cellHeight * row + (cellHeight - ghostHeight) * 0.5
            },
            velocity: { x: ghostVelocityX, y: ghostVelocityY },
            width: ghostWidth,
            height: ghostHeight
        })
    }

    // Resize all game objects
    resizeGameObjects() {
        const cellWidth = Math.floor(this.canvas.width / this.blueprint[0].length);
        const cellHeight = Math.floor(this.canvas.height / this.blueprint.length);
        const pelletRadiusX = 0.08 * cellWidth;
        const pelletRadiusY = 0.08 * cellHeight;
        this.map = new Map({
            blueprint: this.blueprint,
            cellWidth: cellWidth,
            cellHeight: cellHeight,
            pelletRadius: {
                x: pelletRadiusX,
                y: pelletRadiusY
            }
        });

        this.player = this.spawnAndResizePlayer(cellWidth, cellHeight);
        this.ghosts = [];
        this.ghosts.push(this.spawnAndResizeGhost(cellWidth, cellHeight));
    }

    // Update all the game objects
    updateGameObjects() {
        this.playerController.update();
    }

    // Draw all the game objects
    draw() {
        const ctx = this.canvas.getContext("2d");
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.map.draw(ctx);
        this.player.draw(ctx);

        this.ghosts.forEach(ghost => ghost.draw(ctx));
    }
}

export default Game;