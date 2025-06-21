import { useContext, useState } from "react";
import GameContext from "../../../store/gameContext";
import constants from "../../../store/constants";
import DropdownIcon from "../../ui/DropdownIcon";

function GameForm({ type = "start", expanded = false }) {
  const gameContext = useContext(GameContext);
  const [isExpanded, setIsExpanded] = useState(expanded);
  const [playerType, setPlayerType] = useState(gameContext.playerType);

  const handleStart = () => {
    gameContext.handleStartGame(playerType);
  };

  return (
    <>
      {/* Game Information */}
      <div className="flex flex-col items-center mt-8 w-full">
        <div className="flex items-center justify-center gap-10">
          <h2 className="text-xl font-bold">
            {type === "start" ? "Game Information" : "Review Game Info"}
          </h2>
          <button onClick={() => setIsExpanded((prev) => !prev)}>
            <DropdownIcon className={isExpanded ? "rotate-180" : "rotate-0"} />
          </button>
        </div>
        {isExpanded && (
          <div
            className={`flex items-center w-full justify-between mt-4 ${
              isExpanded ? "fade-in w-full" : ""
            }`}
          >
            <label
              htmlFor="playerType"
              className="w-full text-md text-left font-bold"
            >
              Player
            </label>
            <select
              id="playerType"
              name="playerType"
              className="bg-white text-black text-center text-last-center border border-gray-600 rounded px-3 py-1 w-full text-md h-8"
              value={playerType}
              onChange={(e) => setPlayerType(e.target.value)}
            >
              {constants.PLAYER_TYPES.map((type) => (
                <option value={type} key={type}>
                  {type === "bot" ? "Bot" : "User"}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Game Controls */}
      <div className="game-form flex justify-between items-center w-full mt-8 gap-8">
        {type === "start" && (
          <button className="control-btn enter-simulator-btn">
            Enter Simulator
          </button>
        )}
        <button className="control-btn start-game-btn" onClick={handleStart}>
          {type === "start" ? "Start Game" : "Restart Game"}
        </button>
        {type === "restart" && (
          <button
            className="control-btn quit-btn"
            onClick={() => gameContext.handleInterruptGame()}
          >
            Quit Game
          </button>
        )}
      </div>
    </>
  );
}

export default GameForm;
