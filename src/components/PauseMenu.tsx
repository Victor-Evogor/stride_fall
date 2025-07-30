import { useAppContext } from "../AppContext";
import buttonSqaureBrownBg from "../assets/UI/buttonSquare_brown.png";
import buttonSqaureBeigeBg from "../assets/UI/buttonSquare_beige.png";
import buttonSqaureBlueBg from "../assets/UI/buttonSquare_blue.png";
import {
  PlayIcon,
  ArrowCounterClockwiseIcon,
  XCircleIcon,
} from "@phosphor-icons/react";

const PauseMenu = () => {
  const { isPaused, setIsPaused, isGameOver } = useAppContext();
  if (!isPaused) return null;

  const handlePlayClick = () => {
    if (isGameOver) return; // 🔒 prevent resume after game over
    setIsPaused((prev) => {
      const nextPaused = !prev;
      window.dispatchEvent(
        new CustomEvent("pauseGame", {
          detail: { isPaused: nextPaused },
        })
      );
      return nextPaused;
    });
  };

  const handleRestartClick = () => {
    window.dispatchEvent(new CustomEvent("restartGame"));
  };

  const handleCloseClick = () => {
    window.dispatchEvent(new CustomEvent("endGame"));
  };

  const buttonClass =
    "relative group w-20 h-20 transform transition duration-300 ease-in-out hover:scale-110 hover:-translate-y-1 cursor-pointer";

  const tooltipClass =
    "absolute -top-9 left-1/2 -translate-x-1/2 bg-black text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 group-hover:scale-100 scale-90 transition duration-300 z-50 pointer-events-none text-nowrap";

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 flex space-x-8">
      {/* Play Button */}
      <div
        className={`${buttonClass} ${isGameOver ? "opacity-50 pointer-events-none" : ""}`}
      >
        <div className={tooltipClass}>Resume</div>
        <img
          src={buttonSqaureBeigeBg}
          alt="Play Button Background"
          className="w-full h-full object-contain"
        />
        <div
          className="absolute inset-0 flex items-center justify-center"
          onClick={handlePlayClick}
        >
          <PlayIcon size={32} color="#213313" weight="fill" />
        </div>
      </div>

      {/* Restart Button */}
      <div className={buttonClass}>
        <div className={tooltipClass}>Restart</div>
        <img
          src={buttonSqaureBrownBg}
          alt="Restart Button Background"
          className="w-full h-full object-contain"
        />
        <div
          className="absolute inset-0 flex items-center justify-center"
          onClick={handleRestartClick}
        >
          <ArrowCounterClockwiseIcon size={32} color="#ffce00" weight="duotone" />
        </div>
      </div>

      {/* Exit Button */}
      <div className={buttonClass}>
        <div className={tooltipClass}>End Game</div>
        <img
          src={buttonSqaureBlueBg}
          alt="Exit Button Background"
          className="w-full h-full object-contain"
        />
        <div
          className="absolute inset-0 flex items-center justify-center"
          onClick={handleCloseClick}
        >
          <XCircleIcon size={32} color="#ff004c" weight="duotone" />
        </div>
      </div>
    </div>
  );
};

export default PauseMenu;
