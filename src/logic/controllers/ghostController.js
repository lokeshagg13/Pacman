import gameConfig from "../gameConfig";
import PathFinder from "../world/pathFinder";
import Blueprint from "../world/blueprint";

class GhostController {
    static directions = gameConfig.MAP.DIRECTIONS;
    static rowOffset = gameConfig.MAP.ROW_OFFSET;
    static colOffset = gameConfig.MAP.COL_OFFSET;

    constructor(game) {
        this.game = game;
        this.randomStepLimit = gameConfig.GHOST.MOVEMENT.RANDOM_STEP_LIMIT;
        this.pathUpdateInterval = gameConfig.GHOST.MOVEMENT.PATH_UPDATE_INTERVAL;
        this.lastPathUpdateTime = null;
    }

    // Check if ghost is within the proximity of the player
    #isPlayerWithinGhostProximity(ghost) {
        const { player } = this.game;
        const distance = {
            x: ghost.position.x - player.position.x,
            y: ghost.position.y - player.position.y
        };
        return (
            (distance.x ** 2) / (ghost.promixityRadius.x ** 2) + (distance.y ** 2) / (ghost.promixityRadius.y ** 2) <= 1
        );
    }

    // Checks for a particular ghost's movement based on current position and next potential positions
    #isPositionalMovementValid(ghost, direction) {
        const { map } = this.game;

        if (!GhostController.directions.includes(direction)) {
            return false;
        }

        const ghostNextPosition = ghost.getNextStateBoundingPositions(
            direction,
            map.cellWidth,
            map.cellHeight
        );

        for (let i = 0; i < map.boundaries.length; i++) {
            const currentBoundary = map.boundaries[i].boundingBox;
            if (
                ghostNextPosition.top < currentBoundary.bottom &&
                ghostNextPosition.right > currentBoundary.left &&
                ghostNextPosition.bottom > currentBoundary.top &&
                ghostNextPosition.left < currentBoundary.right
            ) {
                return false;
            }
        }
        return true;
    }

    // Checks for a particular ghost's movement based on current cell (row and col of the map) and next potential cell
    #isCellMovementValid(ghost, direction) {
        const { map } = this.game;

        const { row: ghostRow, col: ghostCol } = ghost.indices;

        const newRow = ghostRow + (GhostController.rowOffset[direction] || 0);
        const newCol = ghostCol + (GhostController.colOffset[direction] || 0);

        return (
            newRow >= 0 &&
            newRow < map.numRows &&
            newCol >= 0 &&
            newCol < map.numCols &&
            Blueprint.movableSymbols.includes(map.blueprint[newRow][newCol])
        );
    }

    // Combined checks of a particular ghost's positional and cell movement
    #isRandomMovementValid(ghost, direction) {
        return (
            this.#isPositionalMovementValid(ghost, direction) &&
            this.#isCellMovementValid(ghost, direction)
        );
    }

    // Get a random direction for ghost to move along
    #getRandomDirection(excludeDirections = []) {
        if (excludeDirections.length === 4) return null;
        let randomDirection = GhostController.directions[Math.floor(Math.random() * GhostController.directions.length)];
        while (excludeDirections.includes(randomDirection)) {
            randomDirection = GhostController.directions[Math.floor(Math.random() * GhostController.directions.length)];
        }
        return randomDirection;
    }

    // Update ghost's movement state randomly
    #updateGhostMovementStateRandomly(ghost) {
        if (
            !ghost.randomDirection ||
            ghost.randomSteps >= this.randomStepLimit ||
            !this.#isRandomMovementValid(ghost, ghost.state)
        ) {
            const excludedDirections = ghost.randomDirection ? [ghost.randomDirection] : [];
            let randomDirection = this.#getRandomDirection(excludedDirections);
            while (randomDirection && !this.#isRandomMovementValid(ghost, randomDirection)) {
                excludedDirections.push(randomDirection);
                randomDirection = this.#getRandomDirection(excludedDirections);
            }
            ghost.randomDirection = randomDirection;
            ghost.randomSteps = 0;
            ghost.changeState(randomDirection);
        }
        ghost.randomSteps += 1;
    }

    // Recalculate Path to Player
    #recalculatePathToPlayer(ghost) {
        const { player, map } = this.game;

        ghost.targetCell = null;
        ghost.targetPosition = null;
        ghost.pathToPlayer = PathFinder.findPath(
            ghost.indices,
            player.indices,
            map.movableGrid,
            [gameConfig.MAP.CELL_MOBILITY_STATES.BLOCKED]    // For ghosts, the ghost proximity cells are not blocked at all
        );
        ghost.pathIndex = 0;
        if (ghost.pathToPlayer.length === 0) {
            this.#updateGhostMovementStateRandomly(ghost);
        }
    }

    // Update ghost's movement state based on  path towards the player while keeping away from walls (according to moval)
    #updateGhostMovementStateBasedOnPath(ghost) {
        const { map } = this.game;
        const now = new Date().getTime();
        if (now - this.lastPathUpdateTime > this.pathUpdateInterval) {
            this.#recalculatePathToPlayer(ghost);
            this.lastPathUpdateTime = now;
        }

        if (
            ghost.pathIndex >= 0 &&
            ghost.pathIndex < ghost.pathToPlayer.length
        ) {
            if (!ghost.targetCell && !ghost.targetPosition) {
                const { row, col, direction } = ghost.pathToPlayer[ghost.pathIndex];
                ghost.targetCell = { row, col };
                ghost.targetPosition = map.getCanvasPositionForArrayIndices({
                    position: ghost.targetCell,
                    offset: { x: 0.5, y: 0.5 }
                });
                ghost.changeState(direction);
            }

            if (ghost.hasReachedCurrentTarget()) {
                ghost.pathIndex += 1;
                if (ghost.pathIndex >= ghost.pathToPlayer.length) {
                    this.#recalculatePathToPlayer(ghost);
                    this.lastPathUpdateTime = now;
                    return;
                }
                const { row, col, direction } = ghost.pathToPlayer[ghost.pathIndex];
                ghost.targetCell = { row, col };
                ghost.targetPosition = map.getCanvasPositionForArrayIndices({
                    position: ghost.targetCell,
                    offset: { x: 0.5, y: 0.5 }
                });
                ghost.changeState(direction);
            } else {
                const { direction } = ghost.pathToPlayer[ghost.pathIndex];
                ghost.changeState(direction);
            }
        } else {
            this.#recalculatePathToPlayer(ghost);
            this.lastPathUpdateTime = now;
        }
    }

    // Move the ghost and adjust its position
    #moveGhostCarefully(ghost) {
        const { map } = this.game;
        if (this.#isPositionalMovementValid(ghost, ghost.state)) {
            ghost.move(map.cellWidth, map.cellHeight);
        }
    }

    // Method to update ghosts
    update() {
        const { ghosts } = this.game;
        ghosts.forEach((ghost) => {
            // Update movements
            if (this.#isPlayerWithinGhostProximity(ghost)) {
                this.#updateGhostMovementStateBasedOnPath(ghost);
            } else {
                this.#updateGhostMovementStateRandomly(ghost);
            }

            this.#moveGhostCarefully(ghost);
        });

    }
}

export default GhostController;