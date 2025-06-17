import MainPanel from "./components/MainPanel";
import HeaderImage from "./images/header.png";

function App() {
  return (
    <div className="app p-4 bg-dark-blue min-h-screen app-grid">
      <div className="flex items-center justify-center mb-4">
        <img src={HeaderImage} alt="PongX" className="w-full img-fit" />
      </div>
      <MainPanel />
    </div>
  );
}

export default App;
