import Blueprint from "../world/blueprint";

class PlayerController {
    constructor(game) {
        this.game = game;
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
        };
    }

    // Checks for player's movement based on current position and next potential positions
    isPositionalMovementValid(direction) {
        const { player, map } = this.game;

        if (!["up", "down", "left", "right"].includes(direction)) {
            return false;
        }

        const playerNextPosition = player.getNextStateBoundingPositions(
            direction,
            map.cellWidth,
            map.cellHeight
        );

        for (let i = 0; i < map.boundaries.length; i++) {
            const currentBoundary = map.boundaries[i].boundingBox;
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
        const { player, map } = this.game;

        const rowOffset = { up: -1, down: 1, left: 0, right: 0 };
        const colOffset = { up: 0, down: 0, left: -1, right: 1 };

        const playerRow = Math.floor(player.position.y / map.cellHeight);
        const playerCol = Math.floor(player.position.x / map.cellWidth);

        const newRow = playerRow + (rowOffset[direction] || 0);
        const newCol = playerCol + (colOffset[direction] || 0);

        return (
            newRow >= 0 &&
            newRow < map.blueprint.length &&
            newCol >= 0 &&
            newCol < map.blueprint[0].length &&
            Blueprint.movableSymbols.includes(map.blueprint[newRow][newCol])
        );
    }

    // Combined checks of player's positional and cell movement
    isOverallPlayerMovementValid(direction) {
        return (
            this.isPositionalMovementValid(direction) &&
            this.isCellMovementValid(direction)
        );
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
            this.game.player.changeState(direction);
        }
    }

    // Move the player and adjust the position
    movePlayerCarefully() {
        const { player, map } = this.game;

        if (this.isPositionalMovementValid(player.state)) {
            player.move();
            player.snapToGrid(map.cellWidth, map.cellHeight);
        }
    }

    // Checks and removes any pellets that collide with the player
    checkPelletCollision() {
        const { player, map } = this.game;
        const playerCenterX = player.position.x;
        const playerCenterY = player.position.y;
        const playerRadiusX = player.radius.x;
        const playerRadiusY = player.radius.y;

        map.pellets = map.pellets.filter(pellet => {
            const pelletCenterX = pellet.position.x;
            const pelletCenterY = pellet.position.y;
            const pelletRadiusX = pellet.radius.x;
            const pelletRadiusY = pellet.radius.y;

            const distanceX = Math.abs(playerCenterX - pelletCenterX);
            const distanceY = Math.abs(playerCenterY - pelletCenterY);

            const isCollision =
                distanceX <= (playerRadiusX + pelletRadiusX) &&
                distanceY <= (playerRadiusY + pelletRadiusY);

            if (isCollision) {
                this.game.incrementScore();
                return false;
            }
            return true;
        });
    }

    // Public method to update player-related actions
    update() {
        this.updatePlayerMovement();
        this.movePlayerCarefully();
        this.checkPelletCollision();
    }
}

export default PlayerController;
