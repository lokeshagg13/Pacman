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
    #removeBoundariesWithCanvasPosition({x, y}) {
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
                this.#removeBoundariesWithCanvasPosition({x, y});
                this.#addBoundary(constants.MAP.JAIL_BLOCK_SYMBOL, { x, y });
            } else {
                // Disappear jail bars
                this.#removeBoundariesWithCanvasPosition({x, y});
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

    // Find shortest path between source and destination positions
    findShortestPath({ source, destination }) {
        source = this.getArrayIndicesForCanvasPosition(source);
        destination = this.getArrayIndicesForCanvasPosition(destination);

        const directions = [
            { row: -1, col: 0, move: "up" },   // Up
            { row: 1, col: 0, move: "down" },  // Down
            { row: 0, col: -1, move: "left" }, // Left
            { row: 0, col: 1, move: "right" }  // Right
        ];
        const queue = [[source.row, source.col, []]];
        const visited = Array.from({ length: this.numRows }, () => Array(this.numCols).fill(false));

        visited[source.row][source.col] = true;

        while (queue.length > 0) {
            const [currentRow, currentCol, path] = queue.shift();

            if (currentRow === destination.row && currentCol === destination.col) {
                return path;
            }

            for (const { row: dRow, col: dCol, move } of directions) {
                const newRow = currentRow + dRow;
                const newCol = currentCol + dCol;

                if (
                    newRow >= 0 &&
                    newRow < this.numRows &&
                    newCol >= 0 &&
                    newCol < this.numCols &&
                    Blueprint.movableSymbols.includes(this.blueprint[newRow][newCol]) &&
                    !visited[newRow][newCol]
                ) {
                    visited[newRow][newCol] = true;
                    queue.push([newRow, newCol, [...path, move]]);
                }
            }
        }

        return null;
    }

    // Draw the map on the canvas
    draw(ctx) {
        this.boundaries.forEach((boundary) => {
            boundary.draw(ctx);
        });
    }
}

export default Map;