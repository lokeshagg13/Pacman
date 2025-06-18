import Blueprint from "./blueprint";
import Boundary from "./boundary";
import Pellet from "../objects/pellet";

class Map {
    constructor({ blueprint, cellWidth, cellHeight, pelletRadius }) {
        this.blueprint = blueprint;
        this.cellWidth = cellWidth;
        this.cellHeight = cellHeight;
        this.pelletRadius = pelletRadius;
        this.pellets = [];
        this.boundaries = [];
        this.#generate();
    }

    // Generate the map based on the blueprint
    #generate() {
        this.blueprint.forEach((row, i) => {
            row.forEach((symbol, j) => {
                const x = this.cellWidth * j;
                const y = this.cellHeight * i;

                if (Blueprint.spawnSymbols.includes(symbol)) {
                    return;
                }
                if (symbol === ".") {
                    this.pellets.push(
                        new Pellet({
                            position: {
                                x: x + 0.5 * this.cellWidth,
                                y: y + 0.5 * this.cellHeight
                            },
                            radius: this.pelletRadius
                        })
                    );
                } else {
                    this.boundaries.push(
                        new Boundary({
                            symbol: symbol,
                            position: { x, y },
                            width: this.cellWidth,
                            height: this.cellHeight
                        })
                    );
                }
            });
        });
    }

    // Draw the map on the canvas
    draw(ctx) {
        this.boundaries.forEach((boundary) => {
            boundary.draw(ctx);
        });
        this.pellets.forEach((pellet) => {
            pellet.draw(ctx);
        });
    }
}

export default Map;