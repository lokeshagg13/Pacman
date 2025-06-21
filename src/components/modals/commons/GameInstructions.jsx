import { useState } from "react";
import DropdownIcon from "../../ui/DropdownIcon";
import PacmanImage from "../../../images/pacman/pacman.svg";

function GameInstructions({ expanded = false }) {
  const [isExpanded, setIsExpanded] = useState(expanded);

  return (
    <div className="flex flex-col items-center mt-8 w-full">
      <div className="flex items-center justify-center gap-10">
        <h2 className="text-xl font-bold">Keyboard Controls</h2>
        <button onClick={() => setIsExpanded((prev) => !prev)}>
          <DropdownIcon className={isExpanded ? "rotate-180" : "rotate-0"} />
        </button>
      </div>
      {isExpanded && (
        <div
          className={`flex flex-wrap gap-1r mt-4 w-full key-adjust ${
            isExpanded ? "fade-in" : ""
          }`}
        >
          <div className="flex-box">
            <div className="flex items-center justify-center gap-5">
              <div>
                <div className="flex items-center justify-center w-12 h-8 border rounded text-lg font-bold">
                  A
                </div>
              </div>
              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-center w-12 h-8 border rounded text-lg font-bold">
                  W
                </div>
                <div className="flex items-center justify-center w-12 h-8 bg-black border rounded text-lg font-bold p-3">
                  <img src={PacmanImage} alt="Pacman" className="w-auto h-inherit" />
                </div>
                <div className="flex items-center justify-center w-12 h-8 border rounded text-lg font-bold">
                  S
                </div>
              </div>
              <div>
                <div className="flex items-center justify-center w-12 h-8 border rounded text-lg font-bold">
                  D
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center text-center md:w-full text-lg font-bold">OR</div>
          <div className="flex-box no-emoji-style">
            <div className="flex items-center justify-center gap-5">
              <div>
                <div className="flex items-center justify-center w-12 h-8 border rounded text-lg font-bold">
                  ◀
                </div>
              </div>
              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-center w-12 h-8 border rounded text-lg font-bold">
                  ▲
                </div>
                <div className="flex items-center justify-center w-12 h-8 bg-black border rounded text-lg font-bold p-3">
                  <img src={PacmanImage} alt="Pacman" className="w-auto h-inherit" />
                </div>
                <div className="flex items-center justify-center w-12 h-8 border rounded text-lg font-bold">
                  ▼
                </div>
              </div>
              <div>
                <div className="flex items-center justify-center w-12 h-8 border rounded text-lg font-bold">
                  ▶
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default GameInstructions;
