import GameCanvas from "./GameCanvas";
import GameBoard from "./gameboard/GameBoard";

function MainPanel() {
  return (
    <div className="flex flex-col items-center justify-center gap-1r">
      <GameBoard />
      <GameCanvas />
    </div>
  );
}

export default MainPanel;
