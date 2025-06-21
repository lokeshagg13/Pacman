import { useContext, useEffect, useState } from "react";
import GameContext from "../store/gameContext";
import GamePanel from "./game-panel/GamePanel";
import StartModal from "./modals/StartModal";
import WinnerModal from "./modals/WinnerModal";
import GameOverModal from "./modals/GameOverModal";
import PausedModal from "./modals/PausedModal";
import SwipeAnimation from "./modals/SwipeAnimation";

function MainPanel() {
  const gameContext = useContext(GameContext);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (
      gameContext.gameStatus !== "running" ||
      gameContext.playerType !== "user"
    )
      return;

    const checkTouchDevice = () => {
      const touchSupport =
        "ontouchstart" in window || navigator.maxTouchPoints > 0;
      setIsTouchDevice(touchSupport);
      setShowHint(touchSupport);
    };

    const handleFirstTouch = () => {
      setShowHint(false);
      window.removeEventListener("touchstart", handleFirstTouch);
    };

    checkTouchDevice();

    if (isTouchDevice) {
      window.addEventListener("touchstart", handleFirstTouch);
    }

    return () => {
      window.removeEventListener("touchstart", handleFirstTouch);
    };
  }, [isTouchDevice, gameContext.gameStatus, gameContext.playerType]);

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

      {/* Swipe Animation */}
      {showHint && <SwipeAnimation />}

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

      {/* Paused Overlay */}
      {gameContext.gameStatus === "paused" && <PausedModal />}
    </div>
  );
}

export default MainPanel;
