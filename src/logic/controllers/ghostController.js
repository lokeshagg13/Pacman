import Blueprint from "../world/blueprint";

class GhostController {
    static directions = ["up", "down", "left", "right"];
    constructor(game) {
        this.game = game;
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

        const rowOffset = { up: -1, down: 1, left: 0, right: 0 };
        const colOffset = { up: 0, down: 0, left: -1, right: 1 };

        const ghostRow = Math.floor(ghost.position.y / map.cellHeight);
        const ghostCol = Math.floor(ghost.position.x / map.cellWidth);

        const newRow = ghostRow + (rowOffset[direction] || 0);
        const newCol = ghostCol + (colOffset[direction] || 0);

        return (
            newRow >= 0 &&
            newRow < map.blueprint.length &&
            newCol >= 0 &&
            newCol < map.blueprint[0].length &&
            Blueprint.movableSymbols.includes(map.blueprint[newRow][newCol])
        );
    }

    // Combined checks of a particular ghost's positional and cell movement
    isOverallGhostMovementValid(ghost, direction) {
        return (
            this.isPositionalMovementValid(ghost, direction) &&
            this.isCellMovementValid(ghost, direction)
        );
    }

    getRandomDirection(excludeDirections = []) {
        if (excludeDirections.length === 4) return null;
        let randomDirection = GhostController.directions[Math.floor(Math.random() * GhostController.directions.length)];
        while (excludeDirections.includes(randomDirection)) {
            randomDirection = GhostController.directions[Math.floor(Math.random() * GhostController.directions.length)];
        }
        return randomDirection;
    }

    // Update ghost's movement state based on key presses
    updateGhostMovement(ghost) {
        const excludedDirections = ghost.state ? [ghost.state] : [];
        let randomDirection = this.getRandomDirection(excludedDirections);
        while (randomDirection && !this.isOverallGhostMovementValid(ghost, randomDirection) && excludedDirections.length < 4) {
            excludedDirections.push(randomDirection);
            randomDirection = this.getRandomDirection(excludedDirections);
        }
        ghost.changeState(randomDirection);
    }

    // Move the player and adjust the position
    moveGhostCarefully(ghost) {
        const map = this.game.map;

        if (this.isPositionalMovementValid(ghost, ghost.state)) {
            ghost.move();
            ghost.snapToGrid(map.cellWidth, map.cellHeight);
            ghost.straightSteps += 1;
        } else {
            this.updateGhostMovement(ghost);
            ghost.straightSteps = 0;
        }

        if (ghost.straightSteps > 200) {
            this.updateGhostMovement(ghost);
            ghost.straightSteps = 0;
        }
    }

    // Update ghost-related actions
    update() {
        this.game.ghosts.forEach((ghost) => {
            this.moveGhostCarefully(ghost);
        });
    }
}

export default GhostController;