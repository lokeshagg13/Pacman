import { useContext, useEffect } from "react";
import { initGame } from "../logic/gameLoop";
import GameContext from "../store/gameContext";

function GameCanvas() {
  const gameContext = useContext(GameContext);

  useEffect(() => {
    const gameCanvas = gameContext.gameCanvasRef.current;
    const resizeCanvas = () => {
      gameCanvas.width = Math.min(window.innerWidth * 0.9, 2160);
      gameCanvas.height = Math.min(window.innerHeight * 0.6, 1180);
    };
    resizeCanvas();
    initGame(gameContext.gameCanvasRef.current, {
      incrementScore: gameContext.incrementScore,
      decrementLives: gameContext.decrementLives,
    });
    window.addEventListener("resize", () => resizeCanvas());
    return () =>
      window.removeEventListener("resize", () => resizeCanvas(false));
    // eslint-disable-next-line
  }, []);

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
