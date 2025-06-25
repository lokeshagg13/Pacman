import { useState } from "react";
import DropdownIcon from "../../ui/DropdownIcon";
import PacmanTopImage from "../../../images/pacman/pacman-top.svg";
import PacmanBottomImage from "../../../images/pacman/pacman-bottom.svg";
import PacmanLeftImage from "../../../images/pacman/pacman-left.svg";
import PacmanRightImage from "../../../images/pacman/pacman-right.svg";
import PacmanWholeImage from "../../../images/pacman/pacman-whole.svg";

function GameInstructions({ expanded = false }) {
  const [isExpanded, setIsExpanded] = useState(expanded);
  const [instructionImages, setInstructionImages] = useState([
    PacmanRightImage,
    PacmanRightImage,
  ]);

  const changeInstructionImage = (direction, index) => {
    setInstructionImages((prevInstructionImages) => {
      const newInstructionImages = [...prevInstructionImages];
      newInstructionImages[index] =
        direction === "up"
          ? PacmanTopImage
          : direction === "down"
          ? PacmanBottomImage
          : direction === "left"
          ? PacmanLeftImage
          : direction === "right"
          ? PacmanRightImage
          : PacmanWholeImage;
      return newInstructionImages;
    });
  };

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
                <div
                  className="flex items-center justify-center w-12 h-8 border rounded text-lg font-bold cursor-pointer expand-on-hover"
                  onClick={() => changeInstructionImage("left", 0)}
                >
                  A
                </div>
              </div>
              <div className="flex flex-col gap-5">
                <div
                  className="flex items-center justify-center w-12 h-8 border rounded text-lg font-bold cursor-pointer expand-on-hover"
                  onClick={() => changeInstructionImage("up", 0)}
                >
                  W
                </div>
                <div
                  className="flex items-center justify-center w-12 h-8 bg-black border rounded text-lg font-bold p-3 cursor-pointer expand-on-hover"
                  onClick={() => changeInstructionImage(null, 0)}
                >
                  <img
                    src={instructionImages[0]}
                    alt="Pacman"
                    className="w-auto h-inherit"
                  />
                </div>
                <div
                  className="flex items-center justify-center w-12 h-8 border rounded text-lg font-bold cursor-pointer expand-on-hover"
                  onClick={() => changeInstructionImage("down", 0)}
                >
                  S
                </div>
              </div>
              <div>
                <div
                  className="flex items-center justify-center w-12 h-8 border rounded text-lg font-bold cursor-pointer expand-on-hover"
                  onClick={() => changeInstructionImage("right", 0)}
                >
                  D
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center text-center md:w-full text-lg font-bold">
            OR
          </div>
          <div className="flex-box no-emoji-style">
            <div className="flex items-center justify-center gap-5">
              <div>
                <div
                  className="flex items-center justify-center w-12 h-8 border rounded text-lg font-bold cursor-pointer expand-on-hover"
                  onClick={() => changeInstructionImage("left", 1)}
                >
                  ◀
                </div>
              </div>
              <div className="flex flex-col gap-5">
                <div
                  className="flex items-center justify-center w-12 h-8 border rounded text-lg font-bold cursor-pointer expand-on-hover"
                  onClick={() => changeInstructionImage("up", 1)}
                >
                  ▲
                </div>
                <div
                  className="flex items-center justify-center w-12 h-8 bg-black border rounded text-lg font-bold p-3 cursor-pointer expand-on-hover"
                  onClick={() => changeInstructionImage(null, 1)}
                >
                  <img
                    src={instructionImages[1]}
                    alt="Pacman"
                    className="w-auto h-inherit"
                  />
                </div>
                <div
                  className="flex items-center justify-center w-12 h-8 border rounded text-lg font-bold cursor-pointer expand-on-hover"
                  onClick={() => changeInstructionImage("down", 1)}
                >
                  ▼
                </div>
              </div>
              <div>
                <div
                  className="flex items-center justify-center w-12 h-8 border rounded text-lg font-bold cursor-pointer expand-on-hover"
                  onClick={() => changeInstructionImage("right", 1)}
                >
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
