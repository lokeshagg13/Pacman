import constants from "../store/constants";
import Game from "./game";

let game;

// Handle key press
function handleKeyDown(e) {
    if (game.isOnHold) return;
    if (e.key in game.playerController.keyState) {
        e.preventDefault();
        game.playerController.keyState[e.key] = true;
        game.playerController.lastActionType = "key";
        game.playerController.lastActionValue = e.key;
    }
}

// Handle key up
function handleKeyUp(e) {
    if (game.isOnHold) return;
    if (e.key in game.playerController.keyState) {
        e.preventDefault();
        game.playerController.keyState[e.key] = false;
        game.playerController.lastActionType = null;
        game.playerController.lastActionValue = "";
    }
}

export function handleSwipeOnCanvas(direction) {
    if (game.isOnHold) return;
    if (direction in game.playerController.swipeState) {
        game.playerController.resetSwipeStates();
        game.playerController.swipeState[direction] = true;
        game.playerController.lastActionType = "swipe";
        game.playerController.lastActionValue = direction;
    }
}

export function initGame(gameCanvas, playerType, stateHandlers) {
    game = new Game(gameCanvas, stateHandlers);

    const frameDuration = 1000 / constants.GAME.TARGET_FPS;
    let lastTime = performance.now();
    let animationFrameId;
    let isPaused = false;

    function startGameLoop(resumed = false) {
        if (isPaused) return;

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

        if (!resumed) {
            game.beginAudio.play();
            game.generateAndResizeGameObjects();
            game.runJailBarsAnimation();
        }
        animationFrameId = requestAnimationFrame(gameLoop);

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
    }

    // Start Game
    function startGame() {
        isPaused = false;
        lastTime = performance.now();
        startGameLoop(false);
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
            startGameLoop(true);
        }
    }

    // End Game
    function endGame() {
        isPaused = false;
        game.clear();
        game = null;
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