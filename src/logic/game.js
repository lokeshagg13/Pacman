import constants from "../store/constants";
import blueprints from "./data/blueprints.json";
import Map from "./objects/map";
import Player from "./objects/player";

class Game {
    constructor(canvas) {
        // Basic Game Config
        this.canvas = canvas;

        // Game Objects
        this.blueprint = Game.getBlueprint();
        this.map = null;
        this.player = null;

        // Player Movement Controls
        this.keyState = {
            w: false,
            s: false,
            a: false,
            d: false,
            ArrowUp: false,
            ArrowDown: false,
            ArrowLeft: false,
            ArrowRight: false,
            lastKey: ''
        }
    }

    static getBlueprint() {
        return blueprints[0].blueprint;
    }

    // Resizing the pacman player based on map's cell dimensions and canvas dimensions
    resizePlayer(cellWidth, cellHeight) {
        const playerRadiusX = Math.floor(0.4 * cellWidth);
        const playerRadiusY = Math.floor(0.4 * cellHeight);
        const playerVelocityX = constants.PLAYER_VELOCITY_PERC * this.canvas.width;
        const playerVelocityY = constants.PLAYER_VELOCITY_PERC * this.canvas.height;
        return new Player({
            position: { x: cellWidth * 1.5, y: cellHeight * 1.5 },
            velocity: { x: playerVelocityX, y: playerVelocityY },
            radius: { x: playerRadiusX, y: playerRadiusY }
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

        this.player = this.resizePlayer(cellWidth, cellHeight);
    }

    // Checks for player's movement based on current position and next potential positions
    isPositionalMovementValid(direction) {
        if (!["up", "down", "left", "right"].includes(direction)) {
            return false;
        }

        const playerNextPosition = this.player.getNextStateBoundingPositions(
            direction,
            this.map.cellWidth,
            this.map.cellHeight
        );

        for (let i = 0; i < this.map.boundaries.length; i++) {
            const currentBoundary = this.map.boundaries[i].boundingBox;
            if (
                playerNextPosition.top < currentBoundary.bottom &&
                playerNextPosition.right > currentBoundary.left &&
                playerNextPosition.bottom > currentBoundary.top &&
                playerNextPosition.left < currentBoundary.right
            ) {
                return false;
            }
        }
        return true;
    }

    // Checks for player's movement based on current cell (row and col of the map) and next potential cell
    isCellMovementValid(direction) {
        const rowOffset = { up: -1, down: 1, left: 0, right: 0 };
        const colOffset = { up: 0, down: 0, left: -1, right: 1 };

        const playerRow = Math.floor(this.player.position.y / this.map.cellHeight);
        const playerCol = Math.floor(this.player.position.x / this.map.cellWidth);

        const newRow = playerRow + (rowOffset[direction] || 0);
        const newCol = playerCol + (colOffset[direction] || 0);

        return (
            newRow >= 0 &&
            newRow < this.map.blueprint.length &&
            newCol >= 0 &&
            newCol < this.map.blueprint[0].length &&
            this.map.blueprint[newRow][newCol] === "."
        );
    }

    // Combined checks of player's positional and cell movement
    isOverallPlayerMovementValid(direction) {
        if (!this.isPositionalMovementValid(direction)) return false;
        return this.isCellMovementValid(direction)
    }

    // Update player's movement state based on key presses
    updatePlayerMovement() {
        const directionKeys = {
            w: "up", ArrowUp: "up",
            s: "down", ArrowDown: "down",
            a: "left", ArrowLeft: "left",
            d: "right", ArrowRight: "right"
        };

        const direction = directionKeys[this.keyState.lastKey];
        if (
            direction && this.keyState[this.keyState.lastKey] &&
            this.isOverallPlayerMovementValid(direction)
        ) {
            this.player.changeState(direction);
        }
    }

    // Move the player and adjust the position
    movePlayerCarefully() {
        if (this.isPositionalMovementValid(this.player.state)) {
            this.player.move();
            this.player.snapToGrid(this.map.cellWidth, this.map.cellHeight);
        }
    }

    // Update all the game objects
    updateGameObjects() {
        this.updatePlayerMovement();
        this.movePlayerCarefully();
    }

    // Draw all the game objects
    draw() {
        const ctx = this.canvas.getContext("2d");
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.map.draw(ctx);
        this.player.draw(ctx);
    }
}

export default Game;