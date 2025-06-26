import { useContext, useEffect } from "react";
import SimulatorContext from "../../store/simulatorContext";
import gameConfig from "../../logic/gameConfig";

function SimulatorCanvas() {
  const simulatorContext = useContext(SimulatorContext);

  useEffect(() => {
    const simulatorCanvas = simulatorContext.simulatorCanvasRef.current;
    const aspectRatio = gameConfig.MAP.ASPECT_RATIO;
    simulatorCanvas.height = gameConfig.MAP.RES_HEIGHT;
    simulatorCanvas.width = simulatorCanvas.height * aspectRatio;
  }, [simulatorContext.simulatorCanvasRef]);

  return (
    <div className="canvas-wrapper">
      <canvas
        id="simulatorCanvas"
        ref={simulatorContext.simulatorCanvasRef}
        className="game-canvas"
      />
    </div>
  );
}

export default SimulatorCanvas;
