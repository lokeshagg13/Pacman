import { useContext, useState } from "react";
import gameConfig from "../../../logic/gameConfig";
import GameContext from "../../../store/gameContext";
import DropdownIcon from "../../ui/DropdownIcon";
import SimulatorContext from "../../../store/simulatorContext";

function GameForm({ type = "start", expanded = false }) {
  const gameContext = useContext(GameContext);
  const simulatorContext = useContext(SimulatorContext);
  const [isExpanded, setIsExpanded] = useState(expanded);
  const [playerType, setPlayerType] = useState(gameContext.playerType);
  const [difficultyLevel, setDifficultyLevel] = useState(
    gameContext.difficultyLevel
  );

  const handleStart = () => {
    gameContext.handleStartGame(playerType, difficultyLevel);
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
          <div className={`${isExpanded ? "fade-in w-full" : ""}`}>
            <div className="flex items-center w-full justify-between mt-4">
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
                {gameConfig.PLAYER.TYPES.map((type) => (
                  <option value={type} key={type}>
                    {type === "bot" ? "Bot" : "User"}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center w-full justify-between mt-2">
              <label
                htmlFor="difficultyLevel"
                className="w-full text-md text-left font-bold"
              >
                Difficulty Level
              </label>
              <select
                id="difficultyLevel"
                name="difficultyLevel"
                className="bg-white text-black text-center text-last-center border border-gray-600 rounded px-3 py-1 w-full text-md h-8"
                value={difficultyLevel}
                onChange={(e) => setDifficultyLevel(e.target.value)}
              >
                {gameConfig.GAME.DIFFICULTY_TYPES.map(({ LEVEL }) => (
                  <option value={LEVEL} key={LEVEL}>
                    {LEVEL === "easy"
                      ? "Easy"
                      : LEVEL === "medium"
                      ? "Medium"
                      : "Hard"}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Game Controls */}
      <div className="game-form flex justify-between items-center w-full mt-8 gap-8">
        {type === "start" && (
          <button
            className="control-btn enter-simulator-btn"
            onClick={() => simulatorContext.openSimulator()}
          >
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
