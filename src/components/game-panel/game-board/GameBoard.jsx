import Score from "./Score";
import Lives from "./Lives";

function GameBoard() {
  return (
    <div className="game-board-container">
      <Lives />
      <Score />
    </div>
  );
}

export default GameBoard;
