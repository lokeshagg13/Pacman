import { useContext } from "react";
import GameContext from "../../../store/gameContext";

function Score() {
  const gameContext = useContext(GameContext);

  return (
    <div className="score-section">
      <div className="score-label">Score: </div>
      <div className="score-value">{gameContext.score}</div>
    </div>
  );
}

export default Score;
