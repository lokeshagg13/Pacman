import { useContext } from "react";
import GameContext from "../../store/gameContext";
import Score from "./Score";
import Lives from "./Lives";

function GameBoard() {
  const gameContext = useContext(GameContext);

  return (
    <div className="game-board-container">
      <Lives />
      <Score />
    </div>
  );
}

export default GameBoard;
