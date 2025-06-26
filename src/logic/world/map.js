import constants from "../../store/constants";
import Blueprint from "./blueprint";
import Boundary from "./boundary";

class Map {
    constructor({ blueprint, cellWidth, cellHeight }) {
        this.blueprint = blueprint;
        this.numRows = this.blueprint.length;
        this.numCols = this.blueprint[0].length;
        this.cellWidth = cellWidth;
        this.cellHeight = cellHeight;
        this.boundaries = [];
        this.jailCells = []; // Track position of all jail bar cells
        this.movableGrid = null;
        this.#generateMap();
    }

    // Add a boundary to the map
    #addBoundary(symbol, { x, y }) {
        this.boundaries.push(
            new Boundary({
                symbol: symbol,
                position: { x, y },
                width: this.cellWidth,
                height: this.cellHeight
            })
        );
    }

    // Remove all cells from map that has a specific canvas position
    #removeBoundariesWithCanvasPosition({ x, y }) {
        this.boundaries = this.boundaries.filter((boundary) => {
            return !(boundary.position.x === x && boundary.position.y === y);
        });
    }

    // Generate the map based on the blueprint
    #generateMap() {
        this.blueprint.forEach((row, i) => {
            row.forEach((symbol, j) => {
                if (symbol === constants.MAP.JAIL_BLOCK_SYMBOL) {
                    this.jailCells.push({ row: i, col: j });
                }
                if (Blueprint.movableSymbols.includes(symbol)) {
                    return;
                }
                const x = this.cellWidth * j;
                const y = this.cellHeight * i;
                this.#addBoundary(symbol, { x, y });
            });
        });
    }

    // Toggle Jail Bar Visibility
    toggleJailBars(show, permanent = false) {
        this.jailCells.forEach(({ row, col }) => {
            const { x, y } = this.getCanvasPositionForArrayIndices({
                position: { row, col },
                offset: { x: 0, y: 0 }
            });
            if (show) {
                // Reappear jail bars
                this.blueprint[row][col] = constants.MAP.JAIL_BLOCK_SYMBOL;
                this.#removeBoundariesWithCanvasPosition({ x, y });
                this.#addBoundary(constants.MAP.JAIL_BLOCK_SYMBOL, { x, y });
            } else {
                // Disappear jail bars
                this.#removeBoundariesWithCanvasPosition({ x, y });
                this.blueprint[row][col] =
                    permanent ?
                        constants.MAP.EMPTY_SPACE_SYMBOL :
                        constants.MAP.JAIL_BREAK_SYMBOL;
                if (!permanent) {
                    this.#addBoundary(constants.MAP.JAIL_BREAK_SYMBOL, { x, y });
                }
            }
        });
    }

    removeJailBars() {
        this.jailCells.forEach(({ row, col }) => {
            const { x, y } = this.getCanvasPositionForArrayIndices({
                position: { row, col },
                offset: { x: 0, y: 0 }
            });
            this.#removeBoundariesWithCanvasPosition({ x, y });
            this.blueprint[row][col] =
                constants.MAP.EMPTY_SPACE_SYMBOL;
        });
    }

    // Get array indices (o/p: row and col) for a particular position (i/p: x and y coordinates)
    getArrayIndicesForCanvasPosition(position) {
        return {
            row: Math.floor(position.y / this.cellHeight),
            col: Math.floor(position.x / this.cellWidth)
        };
    }

    // Get canvas position (o/p: x and y coordinates) for a particular array indices (i/p: row and col) with an offset
    getCanvasPositionForArrayIndices({ position, offset }) {
        offset = {
            x: offset ? (offset.x ? Math.max(0, Math.min(1, offset.x)) : 0) : 0,
            y: offset ? (offset.y ? Math.max(0, Math.min(1, offset.y)) : 0) : 0
        };

        return {
            x: this.cellWidth * (position.col + offset.x),
            y: this.cellHeight * (position.row + offset.y)
        };
    }

    // Find the movable grid from the game's blueprint, pellet positions as well as ghost positions
    updateMovableGrid({ applyGhostBlockage = false, ghosts = null, player = null }) {
        const grid = this.blueprint.map(row =>
            row.map(cell =>
                Blueprint.movableSymbols.includes(cell) ?
                    constants.MAP.CELL_MOBILITY_STATES.MOVABLE :
                    constants.MAP.CELL_MOBILITY_STATES.BLOCKED
            )
        );
        this.movableGrid = grid;

        if (!applyGhostBlockage) return;

        // Code to apply blockage in the movable grid due to ghosts (Since ghost blockage is not needed in case of user controlled players or simulation environments)
        const { row: playerRow, col: playerCol } = player.indices;
        ghosts.forEach(ghost => {
            const { row: ghostRow, col: ghostCol } = ghost.indices;
            const rowProximity = constants.PLAYER.AVOID_GHOST_PROXIMITY_CELLS;
            const colProximity = constants.PLAYER.AVOID_GHOST_PROXIMITY_CELLS;

            // Determine where the player is relative to the ghost
            const isAbove = playerRow < ghostRow;
            const isBelow = playerRow > ghostRow;
            const isLeft = playerCol < ghostCol;
            const isRight = playerCol > ghostCol;

            for (let r = ghostRow - rowProximity; r <= ghostRow + rowProximity; r += 1) {
                for (let c = ghostCol - colProximity; c <= ghostCol + colProximity; c += 1) {
                    if (
                        r >= 0 &&
                        c >= 0 &&
                        r < this.numRows &&
                        c < this.numCols
                    ) {
                        // Apply the proximity logic based on the player's relative position
                        const isInsideProximity =
                            (isAbove && r >= ghostRow) || // Top side
                            (isBelow && r <= ghostRow) || // Bottom side
                            (isLeft && c >= ghostCol) ||  // Left side
                            (isRight && c <= ghostCol);   // Right side

                        if (isInsideProximity) {
                            grid[r][c] = constants.MAP.CELL_MOBILITY_STATES.GHOST_PROXIMITY; // Marking it as unsafe to move into
                        }
                    }
                }
            }
        });
        this.movableGrid = grid;
    }

    // Draw the map on the canvas
    draw(ctx, { showGhostProximityGrid = false }) {
        this.boundaries.forEach((boundary) => {
            boundary.draw(ctx);
        });

        if (showGhostProximityGrid) {
            if (!this.movableGrid) return;
            this.movableGrid.forEach((rowArray, row) => {
                rowArray.forEach((cell, col) => {
                    if (cell !== constants.MAP.CELL_MOBILITY_STATES.GHOST_PROXIMITY) return;
                    const { x, y } = this.getCanvasPositionForArrayIndices({
                        position: { row, col },
                        offset: { x: 0, y: 0 }
                    });
                    ctx.fillStyle = "rgba(255, 0,0, 0.4)";
                    ctx.fillRect(x, y, this.cellWidth, this.cellHeight);
                });
            });
        }
    }
}

export default Map;