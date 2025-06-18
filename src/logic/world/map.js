import Blueprint from "./blueprint";
import Boundary from "./boundary";

class Map {
    constructor({ blueprint, cellWidth, cellHeight }) {
        this.blueprint = blueprint;
        this.cellWidth = cellWidth;
        this.cellHeight = cellHeight;
        this.boundaries = [];
        this.#generateMap();
    }

    // Generate the map based on the blueprint
    #generateMap() {
        this.blueprint.forEach((row, i) => {
            row.forEach((symbol, j) => {
                if (Blueprint.movableSymbols.includes(symbol)) {
                    return;
                }

                const x = this.cellWidth * j;
                const y = this.cellHeight * i;
                this.boundaries.push(
                    new Boundary({
                        symbol: symbol,
                        position: { x, y },
                        width: this.cellWidth,
                        height: this.cellHeight
                    })
                );
            });
        });
    }

    // Draw the map on the canvas
    draw(ctx) {
        this.boundaries.forEach((boundary) => {
            boundary.draw(ctx);
        });
    }
}

export default Map;