import { GenomeBuilder, Population } from "neat-javascript";

import config from "../bot/config";
import SimulatorGame from "./game";
import constants from "../../store/constants";
import { findAverageFitness, findAvgGameDuration, findBestGameDuration, saveBestGenome } from "./utils";

let gameDurations = [];

function changePacmanDirection(direction, simulatorGame) {
    simulatorGame.playerController.resetAutoStates();
    simulatorGame.playerController.autoState[direction] = true;
    simulatorGame.playerController.lastActionValue = direction;
}

function guidePacman(genome, simulatorGame) {
    const playerPosition = simulatorGame.player.position;
    const nearestDistancesToPellet = simulatorGame.getPlayerDistanceToNearestPellet();
    const nearestDistancesToGhosts = simulatorGame.getPlayerDistanceToNearestGhost();
    const distancesToWalls = simulatorGame.getPlayerDistanceToWalls();
    const inputs = [
        playerPosition.x,
        playerPosition.y,
        nearestDistancesToPellet.up,
        nearestDistancesToPellet.down,
        nearestDistancesToPellet.left,
        nearestDistancesToPellet.right,
        nearestDistancesToGhosts.up,
        nearestDistancesToGhosts.down,
        nearestDistancesToGhosts.left,
        nearestDistancesToGhosts.right,
        distancesToWalls.up,
        distancesToWalls.down,
        distancesToWalls.left,
        distancesToWalls.right,
    ];

    const outputs = genome.propagate(inputs);
    const decision = outputs.indexOf(Math.max(...outputs));
    if (decision === 0) {
        // Dont change direction
    } else if (decision === 1) {
        changePacmanDirection("up", simulatorGame);
    } else if (decision === 2) {
        changePacmanDirection("down", simulatorGame);
    } else if (decision === 3) {
        changePacmanDirection("left", simulatorGame);
    } else if (decision === 4) {
        changePacmanDirection("right", simulatorGame);
    }
}

function trainAI(genome, canvas, isSimulatorRunning, updateLog) {
    return new Promise((resolve) => {
        let simulatorGame = new SimulatorGame(canvas);
        const frameDuration = 1000 / constants.GAME.TARGET_FPS;
        let startTime = performance.now();
        let lastTime = performance.now();
        let animationFrameId;

        function updateFitness() {
            const gameDuration = (performance.now() - startTime) / 1000;    // In seconds
            gameDurations.push(gameDuration);
            updateLog({
                bestGameDuration: findBestGameDuration(gameDurations),
                avgGameDuration: findAvgGameDuration(gameDurations)
            });
            genome.fitness = simulatorGame.fitness;
        }

        function gameLoop(currentTime) {
            if (!isSimulatorRunning()) {
                cancelAnimationFrame(animationFrameId);
                resolve();
                return;
            }

            const deltaTime = currentTime - lastTime;
            if (deltaTime >= frameDuration) {
                simulatorGame.draw();
                guidePacman(genome, simulatorGame);
                const gameStatus = simulatorGame.updateGameObjects();
                if (
                    gameStatus === "winner" ||
                    gameStatus === "looser" ||
                    simulatorGame.eatenPellets > 50 ||
                    simulatorGame.noMovement > 500
                ) {
                    updateFitness();
                    cancelAnimationFrame(animationFrameId);
                    resolve();
                    return;
                }
                lastTime = currentTime;
            }
            animationFrameId = requestAnimationFrame(gameLoop);
        }
        simulatorGame.generateAndResizeGameObjects();
        simulatorGame.map.removeJailBars();
        animationFrameId = requestAnimationFrame(gameLoop);
    });
}

async function evalGenomes(genomes, canvas, updateLog, isSimulatorRunning) {
    for (let i = 0; i < genomes.length; i++) {
        if (!isSimulatorRunning()) return;
        genomes[i].fitness = 0;
        updateLog({ genome: i + 1 });
        await trainAI(genomes[i], canvas, isSimulatorRunning, updateLog);
    }
}

export async function runSimulation(canvas, updateLog, isSimulatorRunning) {
    // Create a new population with your configuration
    const population = new Population(config);
    // For each generation
    for (let i = 0; i < config.generations; i++) {
        if (!isSimulatorRunning()) break;
        updateLog({ generation: i + 1 });
        gameDurations = [];
        await evalGenomes(population.genomes, canvas, updateLog, isSimulatorRunning);

        const bestGenome = population.getBestGenome();
        const avgFitness = findAverageFitness(population.genomes);

        updateLog({
            bestFitnessScore: bestGenome.fitness.toFixed(2),
            avgFitnessScore: avgFitness.toFixed(2),
        });

        saveBestGenome(bestGenome); // Save the final best genome    
        population.evolve();
    }

    console.log('Simulation Complete!')
}

export async function resumeSimulation(canvas, generationNum, savedGenomeData, updateLog, isSimulatorRunning) {
    // Create a new population with your configuration
    const population = new Population(config);
    const savedGenome = GenomeBuilder.loadGenome(JSON.stringify(savedGenomeData), config);

    population.genomes = population.genomes.map(_ => savedGenome);

    // For each generation
    for (let i = generationNum - 1; i < config.generations; i++) {
        if (!isSimulatorRunning()) break;
        updateLog({ generation: i + 1 });
        gameDurations = [];
        await evalGenomes(population.genomes, canvas, updateLog, isSimulatorRunning);

        if (isSimulatorRunning()) {
            const bestGenome = population.getBestGenome();
            const avgFitness = findAverageFitness(population.genomes);
            updateLog({
                bestFitnessScore: bestGenome.fitness.toFixed(2),
                avgFitnessScore: avgFitness.toFixed(2),
            });
            saveBestGenome(bestGenome); // Save the final best genome
            population.evolve();
        }
    }

    console.log('Simulation Complete!')
}


