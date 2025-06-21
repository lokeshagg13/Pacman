import { useContext, useEffect } from "react";

import GameContext from "../store/gameContext";
import GamePanel from "./game-panel/GamePanel";
import StartModal from "./modals/StartModal";
import WinnerModal from "./modals/WinnerModal";
import GameOverModal from "./modals/GameOverModal";

function MainPanel() {
  const gameContext = useContext(GameContext);

  useEffect(() => {
    if (gameContext.gameStatus === "running") {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [gameContext.gameStatus]);

  return (
    <div>
      {/* Game Panel */}
      <GamePanel />

      {/* Start Modal */}
      {gameContext.gameStatus === null && <StartModal />}

      {/* Won Modal */}
      {gameContext.gameStatus === "completed" && gameContext.isWinner && (
        <WinnerModal />
      )}

      {/* Game Over Modal */}
      {gameContext.gameStatus === "completed" && !gameContext.isWinner && (
        <GameOverModal />
      )}
    </div>
  );
}

export default MainPanel;
