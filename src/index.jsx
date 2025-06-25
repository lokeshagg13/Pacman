import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { GameContextProvider } from "./store/gameContext";
import { SimulatorContextProvider } from "./store/simulatorContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <GameContextProvider>
      <SimulatorContextProvider>
        <App />
      </SimulatorContextProvider>
    </GameContextProvider>
  </React.StrictMode>
);
