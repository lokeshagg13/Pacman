import { useContext, useEffect } from "react";
import SimulatorContext from "../../store/simulatorContext";
import SimulatorLog from "./SimulatorLog";
import SimulatorCanvas from "./SimulatorCanvas";
import SimulatorControl from "./SimulatorControl";

function SimulatorPanel() {
  const simulatorContext = useContext(SimulatorContext);

  useEffect(() => {
    if (simulatorContext.simulatorStatus === "opened") {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [simulatorContext.simulatorStatus]);

  return (
    <>
      {simulatorContext.simulatorStatus !== null && simulatorContext.logInfo && <SimulatorLog />}
      <SimulatorCanvas />
      <SimulatorControl />
    </>
  );
}

export default SimulatorPanel;
