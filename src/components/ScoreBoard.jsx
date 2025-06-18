import { useContext } from "react";
import GameContext from "../store/gameContext";

function ScoreBoard() {
  const gameContext = useContext(GameContext);

  return (
    <div className="scoreboard-container">
      <div className="score-section">
        <div className="score-label">Score: </div>
        <div className="score-value">{gameContext.score}</div>
      </div>
    </div>
  );
}

export default ScoreBoard;
