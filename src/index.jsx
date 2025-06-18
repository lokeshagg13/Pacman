import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { GameContextProvider } from "./store/gameContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <GameContextProvider>
      <App />
    </GameContextProvider>
  </React.StrictMode>
);
