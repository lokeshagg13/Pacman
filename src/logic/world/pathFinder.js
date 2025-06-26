import gameConfig from "../gameConfig";

class PathFinder {
    static getHeuristicCost(currentCell, destCell) {
        // Manhattan Distance
        return Math.abs(currentCell.col - destCell.col) + Math.abs(currentCell.row - destCell.row);
    }

    static getNeighbors(currentCell, movableGrid, blockedCells) {
        const rowOffset = gameConfig.MAP.ROW_OFFSET;
        const colOffset = gameConfig.MAP.COL_OFFSET;
        const neighbors = [];

        for (const dir of gameConfig.MAP.DIRECTIONS) {
            const neighborCell = {
                row: currentCell.row + rowOffset[dir],
                col: currentCell.col + colOffset[dir],
                direction: dir
            };
            if (
                neighborCell.row >= 0 &&
                neighborCell.col >= 0 &&
                neighborCell.row < movableGrid.length &&
                neighborCell.col < movableGrid[0].length &&
                !blockedCells.includes(movableGrid[neighborCell.row][neighborCell.col])
            ) {
                neighbors.push(neighborCell);
            }
        }
        return neighbors;
    }

    static reconstructPath(pathTracker, currentCell) {
        const path = [];
        while (currentCell && currentCell.parent) {
            path.push({
                row: currentCell.row,
                col: currentCell.col,
                direction: currentCell.direction
            });
            currentCell = pathTracker.get(currentCell);
        }
        return path.reverse();
    }

    static findPath(srcCell, destCell, movableGrid, blockedCells) {
        const queue = [srcCell];
        const pathTracker = new Map();
        const gScore = new Map();   // Cost from start to current cell
        const fScore = new Map();   // Estimated cost from source to destination through current cell
        const visited = new Set();  // Track visited nodes

        const maxQueueSize = movableGrid.length * movableGrid[0].length;

        gScore.set(srcCell, 0);
        fScore.set(srcCell, PathFinder.getHeuristicCost(srcCell, destCell));

        while (queue.length > 0 && queue.length <= maxQueueSize) {
            // Get a node with lowest fScore
            const currentCell = queue.sort((a, b) => fScore.get(a) - fScore.get(b))[0];

            if (currentCell.row === destCell.row && currentCell.col === destCell.col) {
                return PathFinder.reconstructPath(pathTracker, currentCell);
            }

            queue.splice(queue.indexOf(currentCell), 1);
            visited.add(`${currentCell.row},${currentCell.col}`);

            for (const neighborCell of PathFinder.getNeighbors(currentCell, movableGrid, blockedCells)) {
                const neighborKey = `${neighborCell.row},${neighborCell.col}`;
                if (visited.has(neighborKey)) continue;

                const tentativeGScore = gScore.get(currentCell) + 1;

                if (tentativeGScore < (gScore.get(neighborCell) || Infinity)) {
                    neighborCell.parent = currentCell;
                    pathTracker.set(neighborCell, currentCell);
                    gScore.set(neighborCell, tentativeGScore);
                    fScore.set(neighborCell, tentativeGScore + PathFinder.getHeuristicCost(neighborCell, destCell));

                    if (!queue.includes(neighborCell)) {
                        queue.push(neighborCell);
                    }
                }
            }
        }
        return [];
    }
}

export default PathFinder;