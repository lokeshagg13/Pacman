import { useContext, useEffect, useRef } from "react";
import GameContext from "../../../store/gameContext";
import gameConfig from "../../../logic/gameConfig";
import { handleSwipeOnCanvas } from "../../../logic/gameLoop";

function GameCanvas() {
  const gameContext = useContext(GameContext);
  const touchStart = useRef({ x: 0, y: 0 });
  const touchEnd = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const gameCanvas = gameContext.gameCanvasRef.current;
    const aspectRatio = gameConfig.MAP.ASPECT_RATIO;
    gameCanvas.height = gameConfig.MAP.RES_HEIGHT;
    gameCanvas.width = gameCanvas.height * aspectRatio;
  }, [gameContext.gameCanvasRef]);

  useEffect(() => {
    const gameCanvas = gameContext.gameCanvasRef.current;

    const handleTouchStart = (e) => {
      if (
        gameContext.gameStatus !== "running" ||
        gameContext.playerType !== "user"
      )
        return;

      e.preventDefault();
      touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const handleTouchMove = (e) => {
      if (
        gameContext.gameStatus !== "running" ||
        gameContext.playerType !== "user"
      )
        return;

      e.preventDefault();
      touchEnd.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const handleTouchEnd = () => {
      if (
        gameContext.gameStatus !== "running" ||
        gameContext.playerType !== "user"
      )
        return;

      const deltaX = touchEnd.current.x - touchStart.current.x;
      const deltaY = touchEnd.current.y - touchStart.current.y;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (deltaX > 30) handleSwipeOnCanvas("right");
        else if (deltaX < -30) handleSwipeOnCanvas("left");
      } else {
        // Vertical swipe
        if (deltaY > 30) handleSwipeOnCanvas("down");
        else if (deltaY < -30) handleSwipeOnCanvas("up");
      }
    };

    gameCanvas.addEventListener("touchstart", handleTouchStart);
    gameCanvas.addEventListener("touchmove", handleTouchMove);
    gameCanvas.addEventListener("touchend", handleTouchEnd);

    // Cleanup event listeners
    return () => {
      gameCanvas.removeEventListener("touchstart", handleTouchStart);
      gameCanvas.removeEventListener("touchmove", handleTouchMove);
      gameCanvas.removeEventListener("touchend", handleTouchEnd);
    };
    // eslint-disable-next-line
  }, [gameContext.gameStatus, gameContext.playerType]);

  return (
    <div className="canvas-wrapper">
      <canvas
        id="gameCanvas"
        ref={gameContext.gameCanvasRef}
        className="game-canvas"
      />
    </div>
  );
}

export default GameCanvas;
