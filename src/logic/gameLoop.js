import constants from "../store/constants";
import Game from "./game";

let game;

// Handle resizing
function handleResize() {
    game.resizeGameObjects();
}

// Handle key press
function handleKeyDown(e) {
    if (e.key in game.keyState) {
        e.preventDefault();
        game.keyState[e.key] = true;
        game.keyState.lastKey = e.key;
    }
}

// Handle key up
function handleKeyUp(e) {
    if (e.key in game.keyState) {
        e.preventDefault();
        game.keyState[e.key] = false;
    }
}

export function initGame(gameCanvas) {
    game = new Game(gameCanvas);

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

        game.resizeGameObjects();
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