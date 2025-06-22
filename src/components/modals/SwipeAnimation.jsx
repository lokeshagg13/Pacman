import SwipeAnimatioImage from "../../images/pacman/pacman_animation.gif";

function SwipeAnimation() {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-trans-black z-10">
      <h2 className="text-2xl font-bold mt-4 text-wheat">Swipe to move the player</h2>
      <img src={SwipeAnimatioImage} alt="Swipe" className="max-w-200px"/>
    </div>
  );
}

export default SwipeAnimation;
