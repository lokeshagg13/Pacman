import { useContext, useEffect } from "react";
import GameContext from "../../../store/gameContext";
import PacmanImage from "../../../images/pacman/pacman.svg";

function Lives() {
  const gameContext = useContext(GameContext);

  useEffect(() => {
    if (gameContext.lives <= 0) {
      gameContext.handleEndGame(false);
    }
  }, [gameContext.lives]);

  return (
    <div className="lives-section">
      <div className="lives-label">Lives: </div>
      <div className="lives-figures">
        {Array.from({ length: gameContext.lives }).map((_, index) => (
          <img
            key={index}
            id={`pacman-life-${index + 1}`}
            src={PacmanImage}
            alt={`Pacman ${index + 1}`}
            className="pacman-life-icon"
          />
        ))}
      </div>
    </div>
  );
}

export default Lives;
