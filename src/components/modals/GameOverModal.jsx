import { useContext, useEffect, useState } from "react";

import StrongPacmanImage from "../../images/pacman/strong-pacman.png";
import CompletionModal from "./commons/CompletionModal";
import GameContext from "../../store/gameContext";

function GameOverModal() {
  const gameContext = useContext(GameContext);
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    if (gameContext.gameStatus === "completed") {
      const currentScore = gameContext.score;
      const storedHighScore = localStorage.getItem("pacmanHighScore");
      if (!storedHighScore || (currentScore > storedHighScore)) {
        localStorage.setItem("pacmanHighScore", currentScore);
        setHighScore(currentScore);
        return;
      }
      setHighScore(storedHighScore);
    }
  }, [gameContext.gameStatus, gameContext.score]);
  return (
    <CompletionModal>
      <div className="game-over-modal">
        <div className="game-over-header">
          <img
            src={StrongPacmanImage}
            alt="Game Over"
            className="game-over-image"
          />
          <h2 className="game-over-title">Game Over</h2>
        </div>
        <div className="score-section">
          <div className="game-over-score">
            <div className="score-title">Your Score: </div>
            <div className="score-value">{gameContext.score}</div>
          </div>
          <div className="high-score">
            <div className="high-score-title">High Score: </div>
            <div className="high-score-value">{highScore}</div>
          </div>
        </div>
      </div>
    </CompletionModal>
  );
}

export default GameOverModal;
