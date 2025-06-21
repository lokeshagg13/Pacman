import HappyPacmanImage from "../../images/pacman/happy-pacman.png";
import CompletionModal from "./commons/CompletionModal";

function WinnerModal() {
  return (
    <CompletionModal>
      <div className="winner-modal">
        <img src={HappyPacmanImage} alt="Won" className="winner-image" />
        <h2 className="winner-title">Pacman Won !!</h2>
      </div>
    </CompletionModal>
  );
}

export default WinnerModal;
