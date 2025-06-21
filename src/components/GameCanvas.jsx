import { useContext, useEffect } from "react";
import { initGame } from "../logic/gameLoop";
import GameContext from "../store/gameContext";
import constants from "../store/constants";

function GameCanvas() {
  const gameContext = useContext(GameContext);

  useEffect(() => {
    const gameCanvas = gameContext.gameCanvasRef.current;
    const aspectRatio = constants.ASPECT_RATIO;
    gameCanvas.height = 1180;
    gameCanvas.width = gameCanvas.height * aspectRatio;
    initGame(gameContext.gameCanvasRef.current, {
      incrementScore: gameContext.incrementScore,
      decrementLives: gameContext.decrementLives,
    });
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
