import { useContext, useEffect } from "react";
import GameContext from "../../../store/gameContext";

function GameControls() {
  const gameContext = useContext(GameContext);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!gameContext.countdownRunning) {
        if (gameContext.gameStatus === "running") {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            gameContext.handlePauseGame();
          }
        } else if (gameContext.gameStatus === "paused") {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            gameContext.handleResumeGame();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [gameContext]);

  return (
    <div className="game-controls-container justify-between">
      <button
        className={`pause-btn ${
          gameContext.gameStatus === "paused" ? "z-100" : "z-0"
        } ${gameContext.countdownRunning ? "disabled-btn" : ""}`}
        onClick={
          gameContext.gameStatus === "running"
            ? () => gameContext.handlePauseGame()
            : gameContext.gameStatus === "paused"
            ? () => gameContext.handleResumeGame()
            : () => {}
        }
        // disabled={gameContext.countdownRunning}
      >
        {gameContext.gameStatus === "running" ? "Pause" : "Resume"}
      </button>
      <button
        className={`quit-btn ${
          gameContext.gameStatus === "paused" ? "z-100" : "z-0"
        } ${gameContext.countdownRunning ? "disabled-btn" : ""}`}
        onClick={
          gameContext.gameStatus === "paused" ||
          gameContext.gameStatus === "running"
            ? () => gameContext.handleInterruptGame()
            : () => {}
        }
        // disabled={gameContext.countdownRunning}
      >
        Quit
      </button>
    </div>
  );
}

export default GameControls;
