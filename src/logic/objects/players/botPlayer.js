import Player from "./player";

class BotPlayer extends Player {
    constructor({ position, indices, velocity, radius }) {
        super({ position, indices, velocity, radius });

        // Variables for Bot related movements
        this.pathIndex = -1;
        this.pathToNearestPellet = [];
        this.targetCell = null;
        this.targetPosition = null;
        this.nearestPelletCell = null;
        this.nearestPelletPosition = null;
    }

    // Find and update the position of a pellet nearest to the bot's current position
    findNearestPellet(pellets, distanceCalculator) {
        let nearestCell = null;
        let nearestPosition = null;
        let minDistance = Infinity;

        for (const pellet of pellets) {
            const distance = distanceCalculator(this.indices, pellet.indices);
            if (distance < minDistance) {
                minDistance = distance;
                nearestCell = pellet.indices;
                nearestPosition = pellet.position;
            }
        }
        return { cell: nearestCell, position: nearestPosition };
    }

    // Check if bot has reached its current target position or not
    hasReachedCurrentTarget() {
        const playerPosition = this.position;
        const playerCell = this.indices;
        if (
            playerCell.row !== this.targetCell.row ||
            playerCell.col !== this.targetCell.col
        ) return false;
        const distanceFromTarget = Math.hypot(
            playerPosition.x - this.targetPosition.x,
            playerPosition.y - this.targetPosition.y
        );
        if (distanceFromTarget >= this.distanceLimit) return false;
        return true;
    }

    // Check if bot has reached the nearest pellet or not
    hasReachedNearestPellet() {
        const playerPosition = this.position;
        const playerCell = this.indices;
        if (
            playerCell.row !== this.nearestPelletCell.row ||
            playerCell.col !== this.nearestPelletCell.col
        ) return false;
        const distanceFromPellet = Math.hypot(
            playerPosition.x - this.nearestPelletPosition.x,
            playerPosition.y - this.nearestPelletPosition.y
        );
        if (distanceFromPellet >= this.distanceLimit) return false;
        return true;
    }
}

export default BotPlayer;