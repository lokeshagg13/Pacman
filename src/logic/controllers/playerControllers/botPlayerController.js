import constants from "../../../store/constants";
import PathFinder from "../../bot/pathFinder";
import PlayerController from "./playerController";

class BotPlayerController extends PlayerController {
    constructor(game, simulation = false) {
        super(game);
        this.simulation = simulation;
        if (simulation) {
            this.autoState = {
                up: false,
                down: false,
                left: false,
                right: false
            };
            this.lastActionValue = "";
        }
    }

    #isCellSafeFromGhosts(cell) {
        const { ghosts } = this.game;
        return !ghosts.some(ghost => {
            const { row: ghostRow, col: ghostCol } = ghost.indices;
            const radius = BotPlayerController.avoidGhostProximityCells;
            return (
                cell.row >= ghostRow - radius &&
                cell.row <= ghostRow + radius &&
                cell.col >= ghostCol - radius &&
                cell.col <= ghostCol + radius
            );
        });
    }

    #getGhostSafeDirection() {
        const { player, map } = this.game;
        const { row: playerRow, col: playerCol } = player.indices;
        const directions = PlayerController.directions;
        const safeDirections = [];

        directions.forEach(dir => {
            const newRow = playerRow + PlayerController.rowOffset[dir];
            const newCol = playerCol + PlayerController.colOffset[dir];
            if (
                newRow >= 0 &&
                newCol >= 0 &&
                newRow < map.numRows &&
                newCol < map.numCols &&
                this.#isCellSafeFromGhosts({ row: newRow, col: newCol }) &&
                map.movableGrid[newRow][newCol] === constants.MAP.CELL_MOBILITY_STATES.MOVABLE

            ) {
                if (!safeDirections.includes(dir))
                    safeDirections.push(dir);
            }
        });
        return safeDirections;
    }

    // Update player movement state randomly (fallback mechanism until a valid path is found)
    #updatePlayerMovementStateRandomly() {
        const { player } = this.game;
        const safeDirections = this.#getGhostSafeDirection();
        let randomDirection;
        if (safeDirections.length > 0) {
            if (safeDirections.includes(player.state)) return;
            randomDirection = safeDirections[Math.floor(Math.random() * safeDirections.length)];
        } else {
            const allDirections = PlayerController.directions;
            randomDirection = allDirections[Math.floor(Math.random() * allDirections.length)]
        }
        player.changeState(randomDirection);
    }

    // Recalculating the nearest pellet and path to nearest pellet
    #recalculatePathToNearestPellet() {
        const { map, player, pellets } = this.game;
        const nearestPellet = player.findNearestPellet(
            pellets,
            (cell1, cell2) => PathFinder.getHeuristicCost(cell1, cell2)
        );
        player.nearestPelletCell = nearestPellet.cell;
        player.nearestPelletPosition = nearestPellet.position;
        player.targetCell = null;
        player.targetPosition = null;
        player.pathToNearestPellet = PathFinder.findPath(
            player.indices,
            nearestPellet.cell,
            map.movableGrid,
            [constants.MAP.CELL_MOBILITY_STATES.BLOCKED, constants.MAP.CELL_MOBILITY_STATES.GHOST_PROXIMITY]    // For bot players, ghost proximity cells are also blocked
        );
        player.pathIndex = 0;
        if (player.pathToNearestPellet.length === 0) {
            this.#updatePlayerMovementStateRandomly();
        }
    }

    // Update player's movement state based on path towards the nearest pellet while keeping away from ghosts (according to the movable grid)
    #updatePlayerMovementStateBasedOnPath() {
        const { player, map } = this.game;
        if (player.pathToNearestPellet.length === 0) {
            this.#recalculatePathToNearestPellet();
        }

        if (
            player.pathIndex >= 0 &&
            player.pathIndex < player.pathToNearestPellet.length
        ) {
            if (!player.targetCell && !player.targetPosition) {
                const { row, col, direction } = player.pathToNearestPellet[player.pathIndex];
                player.targetCell = { row, col };
                player.targetPosition = map.getCanvasPositionForArrayIndices({
                    position: player.targetCell,
                    offset: { x: 0.5, y: 0.5 }
                });
                player.changeState(direction);
            }

            if (player.hasReachedCurrentTarget()) {
                player.pathIndex += 1;
                if (player.pathIndex >= player.pathToNearestPellet.length) {
                    this.#recalculatePathToNearestPellet();
                    return;
                }
                const { row, col, direction } = player.pathToNearestPellet[player.pathIndex];
                player.targetCell = { row, col };
                player.targetPosition = map.getCanvasPositionForArrayIndices({
                    position: player.targetCell,
                    offset: { x: 0.5, y: 0.5 }
                });
                player.changeState(direction);
            } else {
                const { direction } = player.pathToNearestPellet[player.pathIndex];
                player.changeState(direction);
            }
        } else {
            this.#recalculatePathToNearestPellet();
        }
    }

    // Update player's movement state based on automatic states
    #updatePlayerMovementStateBasedOnAutoStates() {
        const { player } = this.game;
        const direction = this.lastActionValue;
        if (
            direction &&
            this.autoState[this.lastActionValue] &&
            this.isOverallPlayerMovementValid(direction)
        ) {
            player.changeState(direction);
        } else {
            this.resetAutoStates();
        }
    }

    // Move the player and adjust its position
    #movePlayerCarefully() {
        const { player, map } = this.game;
        if (this.isPositionalMovementValid(player.state)) {
            player.move(map.cellWidth, map.cellHeight);
            return true;
        }
        return false;
    }

    // Reset auto states
    resetAutoStates() {
        for (let dir in this.autoState) {
            if (this.autoState.hasOwnProperty(dir)) {
                this.autoState[dir] = false;
            }
        }
    }

    // Method to update player-related actions
    update() {
        if (this.simulation) {
            this.#updatePlayerMovementStateBasedOnAutoStates();
        } else {
            this.#updatePlayerMovementStateBasedOnPath();
        }

        const validMove = this.#movePlayerCarefully();
        return validMove;
    }
}

export default BotPlayerController;