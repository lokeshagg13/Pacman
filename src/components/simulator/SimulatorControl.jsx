import { useContext } from "react";
import SimulatorContext from "../../store/simulatorContext";
import SimulatorResumer from "./SimulatorResumer";

function SimulatorControl() {
  const simulatorContext = useContext(SimulatorContext);

  return (
    <div className="flex flex-col space-y-4 w-full simulator-control">
      <div className="flex justify-between items-center w-full gap-8 xs:flex-wrap xs:justify-center">
        <button
          className={`simulator-btn begin-simulator-btn px-4 sm:px-2 ${
            simulatorContext.simulatorStatus === "running" ? "disabled-btn" : ""
          }`}
          onClick={
            simulatorContext.simulatorStatus !== "running"
              ? () => simulatorContext.beginSimulation()
              : () => {}
          }
          disabled={simulatorContext.simulatorStatus === "running"}
        >
          {simulatorContext.simulatorStatus === "running"
            ? "Running Simulation..."
            : "Begin Simulation"}
        </button>
        <button
          className="simulator-btn reset-simulator-btn px-4 sm:px-2"
          onClick={() => simulatorContext.resetSimulator()}
        >
          Reset Simulator
        </button>
        <button
          className="simulator-btn exit-simulator-btn px-4 sm:px-2"
          onClick={() => simulatorContext.closeSimulator()}
        >
          Exit Simulator
        </button>
      </div>

      {simulatorContext.simulatorStatus !== "running" && <SimulatorResumer />}
    </div>
  );
}

export default SimulatorControl;
