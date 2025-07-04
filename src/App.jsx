import { useContext } from "react";
import MainPanel from "./components/MainPanel";
import HeaderImage from "./images/header.png";
import SimulatorContext from "./store/simulatorContext";
import SimulatorPanel from "./components/simulator/SimulatorPanel";
import Footer from "./components/ui/Footer";

function App() {
  const simulatorContext = useContext(SimulatorContext);

  return (
    <div>
      <div className="app p-4 bg-dark-blue min-h-screen app-grid">
        <div className="flex items-center justify-center mb-4">
          <img src={HeaderImage} alt="PongX" className="w-full img-fit" />
        </div>
        {simulatorContext.simulatorStatus === null ? (
          <MainPanel />
        ) : (
          <SimulatorPanel />
        )}
      </div>
      <Footer />
    </div>
  );
}

export default App;
