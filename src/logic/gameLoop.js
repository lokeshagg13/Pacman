import constants from "../store/constants";
import Game from "./game";

let game;

// Handle key press
function handleKeyDown(e) {
    if (game.isOnHold) return;
    if (e.key in game.playerController.keyState) {
        e.preventDefault();
        game.playerController.keyState[e.key] = true;
        game.playerController.keyState.lastKey = e.key;
    }
}

// Handle key up
function handleKeyUp(e) {
    if (game.isOnHold) return;
    if (e.key in game.playerController.keyState) {
        e.preventDefault();
        game.playerController.keyState[e.key] = false;
    }
}

export function initGame(gameCanvas, playerType, stateHandlers) {
    game = new Game(gameCanvas, stateHandlers);

    const frameDuration = 1000 / constants.GAME.TARGET_FPS;
    let lastTime = performance.now();
    let animationFrameId;
    let isPaused = false;

    function startGameLoop() {
        function gameLoop(currentTime) {
            if (!isPaused) {
                const deltaTime = currentTime - lastTime;
                if (deltaTime >= frameDuration) {
                    game.updateGameObjects();
                    game.draw();
                    lastTime = currentTime;
                }
                animationFrameId = requestAnimationFrame(gameLoop);
            }
        }

        game.generateAndResizeGameObjects();
        game.runJailBarsAnimation();
        animationFrameId = requestAnimationFrame(gameLoop);

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
    }

    // Start Game
    function startGame() {
        isPaused = false;
        lastTime = performance.now();
        startGameLoop();
    }

    // Pause Game
    function pauseGame() {
        if (!isPaused) {
            isPaused = true;
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        }
    }

    // Resume Game
    function resumeGame() {
        if (isPaused) {
            isPaused = false;
            lastTime = performance.now();
            animationFrameId = requestAnimationFrame(startGameLoop);
        }
    }

    // End Game
    function endGame() {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("keyup", handleKeyUp);
    }

    return {
        startGame,
        pauseGame,
        resumeGame,
        endGame
    }
}