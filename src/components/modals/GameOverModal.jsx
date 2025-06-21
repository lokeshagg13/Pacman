import StrongPacmanImage from "../../images/pacman/strong-pacman.png";
import CompletionModal from "./commons/CompletionModal";

function GameOverModal() {
  return (
    <CompletionModal>
      <div className="game-over-modal">
        <img
          src={StrongPacmanImage}
          alt="Game Over"
          className="game-over-image"
        />
        <div>
          <h2 className="game-over-title">Game Over</h2>
          <h4 className="game-over-subt">Lets try again !!</h4>
        </div>
      </div>
    </CompletionModal>
  );
}

export default GameOverModal;
