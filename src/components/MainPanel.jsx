import GameCanvas from "./GameCanvas";
import GameBoard from "./gameboard/GameBoard";

function MainPanel() {
  return (
    <div>
      <GameBoard />
      <GameCanvas />
    </div>
  );
}

export default MainPanel;
