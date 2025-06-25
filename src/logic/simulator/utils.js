export function findAverageFitness(genomes) {
    const totalFitness = genomes.reduce((sum, genome) => sum + (genome.fitness || 0), 0);
    return totalFitness / genomes.length;
}

export function formatDuration(durationSeconds) {
    if (durationSeconds < 0.1) {
        return `${(durationSeconds * 1000).toFixed(0)} ms`;
    } else {
        return `${durationSeconds.toFixed(2)} s`;
    }
}

export function findBestGameDuration(gameDurations) {
    if (gameDurations.length === 0) return null;
    return formatDuration(Math.max(...gameDurations));
}

export function findAvgGameDuration(gameDurations) {
    if (gameDurations.length === 0) return null;
    const sum = gameDurations.reduce((acc, val) => acc + val, 0);
    return formatDuration(sum / gameDurations.length);
}

export function saveBestGenome(genome) {
    try {
        localStorage.setItem("bestPacmanGenome", genome.toJSON());
        console.log('Genome saved locally!');
    } catch (error) {
        console.error('Error saving the best genome:', error);
    }
}