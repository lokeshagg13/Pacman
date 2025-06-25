import { useContext } from "react";
import SimulatorContext from "../../store/simulatorContext";

function SimulatorLog() {
  const simulatorContext = useContext(SimulatorContext);

  return (
    <div className="simulator-log-container">
      <div className="simulator-log-card">
        <div className="simulator-log-header">
          <h2>Welcome to Simulator</h2>
        </div>
        <div className="simulator-log-body">
          <div className="simulator-log-row">
            <div className="simulator-log-section">
              <h3>Generation</h3>
              <p>{simulatorContext.logInfo.generation || "-"}</p>
            </div>
            <div className="simulator-log-section">
              <h3>Current Game</h3>
              <p>
                {simulatorContext.logInfo.genome
                  ? `Genome ${simulatorContext.logInfo.genome}`
                  : "-"}
              </p>
            </div>
          </div>
          <div className="simulator-log-row">
            <div className="simulator-log-section">
              <h3>Best Game Duration</h3>
              <p>{simulatorContext.logInfo.bestGameDuration || "-"}</p>
            </div>
            <div className="simulator-log-section">
              <h3>Avg Game Duration</h3>
              <p>{simulatorContext.logInfo.avgGameDuration || "-"}</p>
            </div>
          </div>
          <div className="simulator-log-row">
            <div className="simulator-log-section">
              <h3>Best Fitness Score</h3>
              <p>{simulatorContext.logInfo.bestFitnessScore || "-"}</p>
            </div>
            <div className="simulator-log-section">
              <h3>Avg Fitness Score</h3>
              <p>{simulatorContext.logInfo.avgFitnessScore || "-"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SimulatorLog;
