import constants from "../../store/constants";
import Blueprint from "../world/blueprint";

class PlayerController {
    static directions = constants.MAP.DIRECTIONS;
    static rowOffset = constants.MAP.ROW_OFFSET;
    static colOffset = constants.MAP.COL_OFFSET;

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

        if (!PlayerController.directions.includes(direction)) {
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

        const { row: playerRow, col: playerCol } = this.game.map.getArrayIndicesForCanvasPosition(player.position);

        const newRow = playerRow + (PlayerController.rowOffset[direction] || 0);
        const newCol = playerCol + (PlayerController.colOffset[direction] || 0);

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

    // Public method to update player-related actions
    update() {
        this.updatePlayerMovement();
        this.movePlayerCarefully();
    }
}

export default PlayerController;