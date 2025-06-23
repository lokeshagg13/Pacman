import { useEffect, useRef } from "react";
import Confetti from "react-confetti";

import HappyPacmanImage from "../../images/pacman/happy-pacman.png";
import CompletionModal from "./commons/CompletionModal";

function WinnerModal() {
  const confettiAudioRef = useRef(null);
  confettiAudioRef.current = new Audio(
    `${process.env.PUBLIC_URL}/audios/confetti.mp3`
  );
  const wonAudioRef = useRef(null);
  wonAudioRef.current = new Audio(`${process.env.PUBLIC_URL}/audios/won.mp3`);

  useEffect(() => {
    confettiAudioRef.current.play();
    wonAudioRef.current.play();
  }, []);

  return (
    <CompletionModal>
      <div className="winner-modal">
        <img src={HappyPacmanImage} alt="Won" className="winner-image" />
        <h2 className="winner-title">Pacman Won !!</h2>
      </div>
      <Confetti />
    </CompletionModal>
  );
}

export default WinnerModal;
