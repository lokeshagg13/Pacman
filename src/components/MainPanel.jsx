import GameCanvas from "./GameCanvas";
import ScoreBoard from "./ScoreBoard";

function MainPanel() {
  return (
    <div>
      <ScoreBoard />
      <GameCanvas />
    </div>
  );
}

export default MainPanel;
