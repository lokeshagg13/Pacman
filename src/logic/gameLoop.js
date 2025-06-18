import constants from "../store/constants";
import Game from "./game";

let game;

// Handle resizing
function handleResize() {
    game.generateAndResizeGameObjects();
}

// Handle key press
function handleKeyDown(e) {
    if (e.key in game.playerController.keyState) {
        e.preventDefault();
        game.playerController.keyState[e.key] = true;
        game.playerController.keyState.lastKey = e.key;
    }
}

// Handle key up
function handleKeyUp(e) {
    if (e.key in game.playerController.keyState) {
        e.preventDefault();
        game.playerController.keyState[e.key] = false;
    }
}

export function initGame(gameCanvas, stateHandlers) {
    game = new Game(gameCanvas, stateHandlers);

    const frameDuration = 1000 / constants.TARGET_FPS;
    let lastTime = performance.now();
    let animationFrameId;

    function startGameLoop() {
        function gameLoop(currentTime) {
            const deltaTime = currentTime - lastTime;
            if (deltaTime >= frameDuration) {
                lastTime = currentTime;
                game.updateGameObjects();
                game.draw();
            }
            animationFrameId = requestAnimationFrame(gameLoop);
        }

        game.generateAndResizeGameObjects();
        animationFrameId = requestAnimationFrame(gameLoop);

        window.addEventListener('resize', handleResize);
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
    }

    startGameLoop();

    function endGame() {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("keyup", handleKeyUp);
    }

    return {
        endGame
    }
}