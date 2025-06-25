import { useContext, useEffect } from "react";
import SimulatorContext from "../../store/simulatorContext";
import constants from "../../store/constants";

function SimulatorCanvas() {
  const simulatorContext = useContext(SimulatorContext);

  useEffect(() => {
    const simulatorCanvas = simulatorContext.simulatorCanvasRef.current;
    const aspectRatio = constants.MAP.ASPECT_RATIO;
    simulatorCanvas.height = constants.MAP.RES_HEIGHT;
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
