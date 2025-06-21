import constants from "../../store/constants";
import Blueprint from "../world/blueprint";

class GhostController {
    static directions = ["up", "down", "left", "right"];
    static rowOffset = { up: -1, down: 1, left: 0, right: 0 };
    static colOffset = { up: 0, down: 0, left: -1, right: 1 };

    constructor(game) {
        this.game = game;
        this.randomStepLimit = constants.GHOST.MOVEMENT.RANDOM_STEP_LIMIT;
        this.pathUpdateInterval = constants.GHOST.MOVEMENT.PATH_UPDATE_INTERVAL;
        this.lastPathUpdateTime = null;
    }

    // Check if ghost is within the proximity of the player
    isPlayerWithinGhostProximity(ghost) {
        const { position: playerPosition } = this.game.player;
        const distance = {
            x: ghost.position.x - playerPosition.x,
            y: ghost.position.y - playerPosition.y
        };
        return (
            (distance.x ** 2) / (ghost.promixityRadius.x ** 2) + (distance.y ** 2) / (ghost.promixityRadius.y ** 2) <= 1
        );
    }

    // Checks for a particular ghost's movement based on current position and next potential positions
    isPositionalMovementValid(ghost, direction) {
        const map = this.game.map;

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
    isCellMovementValid(ghost, direction) {
        const map = this.game.map;

        const { row: ghostRow, col: ghostCol } = this.game.map.getArrayIndicesForCanvasPosition(ghost.position);

        const newRow = ghostRow + (GhostController.rowOffset[direction] || 0);
        const newCol = ghostCol + (GhostController.colOffset[direction] || 0);

        return (
            newRow >= 0 &&
            newRow < map.blueprint.length &&
            newCol >= 0 &&
            newCol < map.blueprint[0].length &&
            Blueprint.movableSymbols.includes(map.blueprint[newRow][newCol])
        );
    }

    // Combined checks of a particular ghost's positional and cell movement
    isRandomMovementValid(ghost, direction) {
        return (
            this.isPositionalMovementValid(ghost, direction) &&
            this.isCellMovementValid(ghost, direction)
        );
    }

    // Get a random direction for ghost to move along
    getRandomDirection(excludeDirections = []) {
        if (excludeDirections.length === 4) return null;
        let randomDirection = GhostController.directions[Math.floor(Math.random() * GhostController.directions.length)];
        while (excludeDirections.includes(randomDirection)) {
            randomDirection = GhostController.directions[Math.floor(Math.random() * GhostController.directions.length)];
        }
        return randomDirection;
    }

    // Update ghost's movement state randomly
    updateGhostMovementRandomly(ghost) {
        if (
            !ghost.randomDirection ||
            ghost.randomSteps >= this.randomStepLimit ||
            !this.isRandomMovementValid(ghost, ghost.state)
        ) {
            const excludedDirections = ghost.randomDirection ? [ghost.randomDirection] : [];
            let randomDirection = this.getRandomDirection(excludedDirections);
            while (randomDirection && !this.isRandomMovementValid(ghost, randomDirection)) {
                excludedDirections.push(randomDirection);
                randomDirection = this.getRandomDirection(excludedDirections);
            }
            ghost.randomDirection = randomDirection;
            ghost.randomSteps = 0;
            ghost.changeState(randomDirection);
        }

        ghost.randomSteps += 1;
    }

    // Recalculate Path to Player
    recalculatePathToPlayer(ghost) {
        const shortestPath = this.game.map.findShortestPath({
            source: ghost.position,
            destination: this.game.player.position
        });
        ghost.pathToPlayer = shortestPath || [];
        ghost.pathIndex = 0;
        ghost.targetCell = null;
        ghost.targetPosition = null;
    }

    // Update ghost's movement state along the path to the player
    updateGhostMovementAlongPath(ghost) {
        // Recalculate the path to player after some time
        const now = new Date().getTime();
        if (now - this.lastPathUpdateTime > this.pathUpdateInterval) {
            this.recalculatePathToPlayer(ghost);
            this.lastPathUpdateTime = now;
        }

        // Update the pathIndex if current move is completed
        if (ghost.pathIndex >= 0 && ghost.pathIndex < ghost.pathToPlayer.length) {
            const currentCell = this.game.map.getArrayIndicesForCanvasPosition(ghost.position);

            if (!ghost.targetCell && !ghost.targetPosition) {
                const currentDirection = ghost.pathToPlayer[ghost.pathIndex];
                ghost.targetCell = {
                    row: currentCell.row + GhostController.rowOffset[currentDirection],
                    col: currentCell.col + GhostController.colOffset[currentDirection]
                };
                ghost.targetPosition = this.game.map.getCanvasPositionForArrayIndices({
                    position: ghost.targetCell,
                    offset: { x: 0.5, y: 0.5 }
                });
                ghost.changeState(currentDirection);
            }

            if (currentCell.row === ghost.targetCell.row && currentCell.col === ghost.targetCell.col) {
                const distanceFromTarget = Math.hypot(
                    ghost.position.x - ghost.targetPosition.x,
                    ghost.position.y - ghost.targetPosition.y
                );
                if (distanceFromTarget < 1) {
                    ghost.pathIndex += 1;
                    if (ghost.pathIndex >= ghost.pathToPlayer.length) {
                        this.recalculatePathToPlayer(ghost);
                        this.lastPathUpdateTime = now;
                        return;
                    }
                    const nextDirection = ghost.pathToPlayer[ghost.pathIndex];
                    ghost.targetCell = {
                        row: currentCell.row + GhostController.rowOffset[nextDirection],
                        col: currentCell.col + GhostController.colOffset[nextDirection]
                    };
                    ghost.targetPosition = this.game.map.getCanvasPositionForArrayIndices({
                        position: ghost.targetCell,
                        offset: { x: 0.5, y: 0.5 }
                    });
                    ghost.changeState(nextDirection);
                }
            }
        } else {
            this.recalculatePathToPlayer(ghost);
            this.lastPathUpdateTime = now;
        }
    }

    // Update ghost-related actions
    update() {
        this.game.ghosts.forEach((ghost) => {
            // Update movements
            if (this.isPlayerWithinGhostProximity(ghost)) {
                this.updateGhostMovementAlongPath(ghost);
            } else {
                this.updateGhostMovementRandomly(ghost);
            }

            // Move the ghost in the current state if the move is valid
            if (this.isPositionalMovementValid(ghost, ghost.state)) {
                ghost.move();
                ghost.snapToGrid(this.game.map.cellWidth, this.game.map.cellHeight);
            } else {
                if (this.isPlayerWithinGhostProximity(ghost)) {
                    this.updateGhostMovementAlongPath(ghost);
                } else {
                    this.updateGhostMovementRandomly(ghost);
                }
            }
        });

    }
}

export default GhostController;