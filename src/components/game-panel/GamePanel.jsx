import GameCanvas from "./game-canvas/GameCanvas";
import GameBoard from "./game-board/GameBoard";
import GameControls from "./game-controls/GameControls";

function GamePanel() {
  return (
    <div className="flex flex-col items-center justify-center gap-1r">
      <GameBoard />
      <GameCanvas />
      <GameControls />
    </div>
  );
}

export default GamePanel;
