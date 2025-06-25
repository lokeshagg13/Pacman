import constants from "../../store/constants";
import Blueprint from "../world/blueprint";
import Map from "../world/map";
import Pellet from "../objects/pellet";
import Ghost from "../objects/ghost";
import BotPlayer from "../objects/players/botPlayer";
import BotPlayerController from "../controllers/playerControllers/botPlayerController";
import GhostController from "../controllers/ghostController";

class SimulatorGame {
    constructor(canvas) {
        // Basic Game Config
        this.canvas = canvas;

        // Game Objects
        this.blueprint = Blueprint.fetch();
        this.map = null;
        this.player = null;
        this.ghosts = [];
        this.pellets = [];

        // Game Object Controllers
        this.playerController = new BotPlayerController(this, true);
        this.ghostController = new GhostController(this);

        // Non-progressive move tracker
        this.moveHistory = [];
        this.nonProgressiveMoves = 0;

        // No movement tracker
        this.noMovement = 0;

        // Pellets Eaten
        this.eatenPellets = 0

        // Fitness Score
        this.fitness = 0
    }

    // Create and Resize pellets based on map's cell dimensions
    createAndResizePellets(cellWidth, cellHeight) {
        const pelletRadiusX = constants.PELLET.RADIUS_PERC * cellWidth;
        const pelletRadiusY = constants.PELLET.RADIUS_PERC * cellHeight;

        this.pellets = [];

        this.blueprint.forEach((row, i) => {
            row.forEach((symbol, j) => {
                if (symbol === constants.MAP.PELLET_SYMBOL) {
                    const { x, y } = this.map.getCanvasPositionForArrayIndices({
                        position: { row: i, col: j },
                        offset: { x: 0.5, y: 0.5 }
                    });
                    this.pellets.push(
                        new Pellet({
                            position: { x, y },
                            indices: { row: i, col: j },
                            radius: {
                                x: pelletRadiusX, y: pelletRadiusY
                            }
                        })
                    );
                }
            });
        });
    }

    // Spawn and Resize the pacman player based on map's cell dimensions and canvas dimensions
    spawnAndResizePlayer(cellWidth, cellHeight) {
        const playerRadiusX = Math.floor(constants.PLAYER.RADIUS_PERC * cellWidth);
        const playerRadiusY = Math.floor(constants.PLAYER.RADIUS_PERC * cellHeight);
        const playerVelocityX = constants.PLAYER.SIMULATOR_VELOCITY_PERC * this.canvas.width;
        const playerVelocityY = constants.PLAYER.SIMULATOR_VELOCITY_PERC * this.canvas.height;
        const { row, col } = Blueprint.findElementInBlueprint(
            constants.MAP.SPAWN_SYMBOL.PLAYER_ORIGIN,
            this.blueprint
        );
        const { x, y } = this.map.getCanvasPositionForArrayIndices({
            position: { row, col },
            offset: { x: 0.5, y: 0.5 }
        });

        this.player = new BotPlayer({
            position: { x, y },
            indices: { row, col },
            velocity: { x: playerVelocityX, y: playerVelocityY },
            radius: { x: playerRadiusX, y: playerRadiusY }
        });
    }

    // Spawn and Resize the ghosts based on map's cell dimensions and canvas dimensions
    spawnAndResizeGhosts(cellWidth, cellHeight) {
        const ghostWidth = Math.floor(constants.GHOST.WIDTH_PERC * cellWidth);
        const ghostHeight = Math.floor(constants.GHOST.HEIGHT_PERC * cellHeight);
        const ghostVelocityX = constants.GHOST.SIMULATOR_VELOCITY_PERC * this.canvas.width;
        const ghostVelocityY = constants.GHOST.SIMULATOR_VELOCITY_PERC * this.canvas.height;
        const proximityRadiusPerc = 0.8;    // For Hard Level
        const { row, col } = Blueprint.findElementInBlueprint(
            constants.MAP.SPAWN_SYMBOL.GHOST_ORIGIN,
            this.blueprint
        );
        const { x, y } = this.map.getCanvasPositionForArrayIndices({
            position: { row, col },
            offset: { x: 0.5, y: 0.5 }
        });

        this.ghosts = [];

        for (let i = 0; i < constants.GHOST.COUNT; i++) {
            this.ghosts.push(
                new Ghost({
                    position: { x, y },
                    indices: { row, col },
                    velocity: { x: ghostVelocityX, y: ghostVelocityY },
                    width: ghostWidth,
                    height: ghostHeight,
                    color: constants.GHOST.COLORS[i],
                    promixityRadius: {
                        x: proximityRadiusPerc * this.canvas.width,
                        y: proximityRadiusPerc * this.canvas.height
                    }
                })
            );
        }
    }

    // Generate and Resize all game objects
    generateAndResizeGameObjects() {
        const cellWidth = Math.floor(this.canvas.width / this.blueprint[0].length);
        const cellHeight = Math.floor(this.canvas.height / this.blueprint.length);

        this.map = new Map({
            blueprint: this.blueprint,
            cellWidth: cellWidth,
            cellHeight: cellHeight,
        });
        this.createAndResizePellets(cellWidth, cellHeight);
        this.spawnAndResizePlayer(cellWidth, cellHeight);
        this.spawnAndResizeGhosts(cellWidth, cellHeight);
    }

    // Checks nearest index-based distances of player to pellet in each direction
    getPlayerDistanceToNearestPellet() {
        const { row: playerRow, col: playerCol } = this.player.indices;

        let distances = {
            up: Infinity,
            down: Infinity,
            left: Infinity,
            right: Infinity
        };
        this.pellets.forEach((pellet) => {
            const pelletRow = pellet.indices.row;
            const pelletCol = pellet.indices.col;

            if (pelletCol === playerCol) {
                // Top and Bottom Direction
                if (pelletRow < playerRow) {
                    const distance = playerRow - pelletRow;
                    distances.up = Math.min(distances.up, distance);
                } else if (pelletRow > playerRow) {
                    const distance = pelletRow - playerRow;
                    distances.down = Math.min(distances.down, distance);
                }
            } else if (pelletRow === playerRow) {
                // Left and Right Direction
                if (pelletCol < playerCol) {
                    const distance = playerCol - pelletCol;
                    distances.left = Math.min(distances.left, distance);
                } else if (pelletCol > playerCol) {
                    const distance = pelletCol - playerCol;
                    distances.right = Math.min(distances.right, distance);
                }
            }
        });
        return {
            up: distances.up === Infinity ? -1 : distances.up,
            down: distances.down === Infinity ? -1 : distances.down,
            left: distances.left === Infinity ? -1 : distances.left,
            right: distances.right === Infinity ? -1 : distances.right,
        };
    }

    // Checks nearest index-based distances of player to ghosts in each direction
    getPlayerDistanceToNearestGhost() {
        const { row: playerRow, col: playerCol } = this.player.indices;

        let distances = {
            up: Infinity,
            down: Infinity,
            left: Infinity,
            right: Infinity
        };
        this.ghosts.forEach((ghost) => {
            const { row: ghostRow, col: ghostCol } = ghost.indices;

            if (ghostCol === playerCol) {
                // Top and Bottom Direction
                if (ghostRow < playerRow) {
                    const distance = playerRow - ghostRow;
                    distances.up = Math.min(distances.up, distance);
                } else if (ghostRow > playerRow) {
                    const distance = ghostRow - playerRow;
                    distances.down = Math.min(distances.down, distance);
                }
            } else if (ghostRow === playerRow) {
                // Left and Right Direction
                if (ghostCol < playerCol) {
                    const distance = playerCol - ghostCol;
                    distances.left = Math.min(distances.left, distance);
                } else if (ghostCol > playerCol) {
                    const distance = ghostCol - playerCol;
                    distances.right = Math.min(distances.right, distance);
                }
            }
        });
        return {
            up: distances.up === Infinity ? -1 : distances.up,
            down: distances.down === Infinity ? -1 : distances.down,
            left: distances.left === Infinity ? -1 : distances.left,
            right: distances.right === Infinity ? -1 : distances.right,
        };
    }

    // Find canvas-based distances of player to walls in each directions (1 if no wall and 0 if closest to the wall)
    getPlayerDistanceToWalls() {
        const playerPosition = this.player.position;
        const { row: playerRow, col: playerCol } = this.player.indices;
        const { cellWidth, cellHeight } = this.map;
        const distances = {
            up: 0,
            down: 0,
            left: 0,
            right: 0
        };
        const directions = {
            up: { rowOffset: -1, colOffset: 0, axis: 'y', calc: (pos, wallPos) => (pos - wallPos) / cellHeight },
            down: { rowOffset: 1, colOffset: 0, axis: 'y', calc: (wallPos, pos) => (wallPos - pos) / cellHeight },
            left: { rowOffset: 0, colOffset: -1, axis: 'x', calc: (pos, wallPos) => (pos - wallPos) / cellWidth },
            right: { rowOffset: 0, colOffset: 1, axis: 'x', calc: (wallPos, pos) => (wallPos - pos) / cellWidth }
        };
        for (const [dir, { rowOffset, colOffset, axis, calc }] of Object.entries(directions)) {
            const newRow = playerRow + rowOffset;
            const newCol = playerCol + colOffset;
            if (newRow < 0 || newRow >= this.map.numRows || newCol < 0 || newCol >= this.map.numCols) {
                continue;
            }
            if (Blueprint.movableSymbols.includes(this.map.blueprint[newRow][newCol])) {
                distances[dir] = 1;
                continue;
            }
            const { x: wallX, y: wallY } = this.map.getCanvasPositionForArrayIndices({
                position: { row: newRow, col: newCol },
                offset: { x: 0, y: 0 }
            });
            const wallPos = axis === 'x' ? wallX + (dir === 'left' ? cellWidth : 0) : wallY + (dir === 'up' ? cellHeight : 0);
            const playerPos = axis === 'x' ? playerPosition.x : playerPosition.y;
            distances[dir] = calc(playerPos, wallPos);
        }
        for (const dir in distances) {
            if (distances[dir] < 0.5) distances[dir] = 0;
        }
        return distances;
    }

    // Checks and removes any pellets that collide with the player
    checkPelletsCollision() {
        if (this.pellets.length === 0) {
            this.fitness += 10000;
            return 'winner';
        }
        this.pellets = this.pellets.filter(pellet => {
            if (pellet.isCollidingWithPlayer(this.player)) {
                this.eatenPellets += 1;
                this.fitness += 50;
                return false;
            }
            return true;
        });
    }

    // Checks for ghost colliding with the player
    checkGhostsCollision() {
        let collisionDetected = false;

        this.ghosts.forEach(ghost => {
            if (!collisionDetected && ghost.isCollidingWithPlayer(this.player)) {
                collisionDetected = true;
                this.fitness -= 50;
            }
        });
        if (collisionDetected) return 'looser';
    }

    // Check for non-progressive moves (Where the player is technically moving but no displacing a lot from one position)
    trackAndPenalizeNonProgressiveMoves() {
        const maxHistory = 50;
        const playerPosition = this.player.position;

        this.moveHistory.push(`${playerPosition.x},${playerPosition.y}`);

        if (this.moveHistory.length > maxHistory) {
            this.moveHistory.shift();
        }

        // Check for repetitive movement patterns
        if (this.moveHistory.length === maxHistory) {
            const uniquePositions = new Set(this.moveHistory);
            if (uniquePositions.size <= maxHistory / 2) {
                this.nonProgressiveMoves++;
                this.fitness -= this.nonProgressiveMoves * 3; // Stronger penalty for repetitive moves
            } else {
                this.nonProgressiveMoves = 0;
            }
        }
    }

    rewardProgressTowardPellets() {
        const nearestPelletDistances = this.getPlayerDistanceToNearestPellet();
        const totalPelletDistance =
            nearestPelletDistances.up +
            nearestPelletDistances.down +
            nearestPelletDistances.left +
            nearestPelletDistances.right;

        // Compare with the last recorded pellet distance
        if (this.previousPelletDistance !== undefined) {
            if (totalPelletDistance < this.previousPelletDistance) {
                this.fitness += 10; // Reward for getting closer
            } else if (totalPelletDistance > this.previousPelletDistance) {
                this.fitness -= 5; // Penalize for moving away
            }
        }

        this.previousPelletDistance = totalPelletDistance;
    }

    // Update all the game objects
    updateGameObjects() {
        this.rewardProgressTowardPellets();

        this.trackAndPenalizeNonProgressiveMoves();

        this.player.updateMouthAnimation();

        this.fitness += 1;

        this.ghostController.update();

        const validMove = this.playerController.update();
        if (!validMove) {
            this.noMovement += 1;
            this.fitness -= this.noMovement * 2;
        } else {
            this.fitness += 1;
            this.noMovement = 0;
        }

        if (this.noMovement > 50) {
            this.fitness -= 1000;
        }
        if (this.nonProgressiveMoves > 100) {
            return 'looser';
        }
        const winResult = this.checkPelletsCollision();
        if (winResult === 'winner') return winResult;
        const loseResult = this.checkGhostsCollision();
        if (loseResult === 'looser') return loseResult;
        return null;
    }

    // Draw all the game objects
    draw() {
        const ctx = this.canvas.getContext("2d");
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.map.draw(ctx);
        this.pellets.forEach((pellet) => {
            pellet.draw(ctx);
        });
        this.ghosts.forEach((ghost) => {
            ghost.draw(ctx, {
                showProximity: constants.GHOST.MOVEMENT.SHOW_PROXIMITY
            });
        });
        this.player.draw(ctx);
    }

    // Clear game
    clear() {
        const ctx = this.canvas.getContext("2d");
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

export default SimulatorGame;