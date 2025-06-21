import GameCanvas from "./game-canvas/GameCanvas";
import GameBoard from "./game-board/GameBoard";

function GamePanel() {
  return (
    <div className="flex flex-col items-center justify-center gap-1r">
      <GameBoard />
      <GameCanvas />
    </div>
  );
}

export default GamePanel;
