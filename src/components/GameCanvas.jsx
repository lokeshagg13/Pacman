import { useEffect, useRef } from "react";
import { initGame } from "../logic/gameLoop";

function GameCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const gameCanvas = canvasRef.current;
    const resizeCanvas = () => {
      gameCanvas.width = Math.min(window.innerWidth * 0.9, 2160);
      gameCanvas.height = Math.min(window.innerHeight * 0.6, 1180);
    };
    resizeCanvas();
    initGame(canvasRef.current);
    window.addEventListener("resize", () => resizeCanvas()); // Handle window resize
    return () =>
      window.removeEventListener("resize", () => resizeCanvas(false));
    // eslint-disable-next-line
  }, []);

  return (
    <div className="canvas-wrapper">
      <canvas id="gameCanvas" ref={canvasRef} className="game-canvas" />
    </div>
  );
}

export default GameCanvas;
