import HeaderImage from "../../images/header.png";
import GameForm from "./commons/GameForm";
import GameInstructions from "./commons/GameInstructions";

function StartModal() {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black z-10">
      <div className="flex flex-col  rounded-lg bg-white p-6 scroll-bar text-center">
        <div className="flex items-center bg-black p-6 rounded-lg">
          <img
            src={HeaderImage}
            alt="Pacman"
            className="w-full modal-img-fit"
          />
        </div>
        <div className="flex flex-col items-center gap-5">
          {/* Game Form and Control */}
          <GameForm type="start" expanded={true} />

          {/* Game Instructions */}
          <GameInstructions expanded={true} />
        </div>
      </div>
    </div>
  );
}

export default StartModal;
