import { useEffect } from "react";
import { useAppContext } from "../AppContext";

const Timer = () => {
  const { score, isGameStarted, setScore, isPaused } = useAppContext();

  useEffect(() => {
    let interval: number;

    if (isGameStarted && !isPaused) {
      interval = window.setInterval(() => {
        setScore((prevScore) => prevScore + 1);
      }, 1000);
    }

    const gameOverHandler = () => {
      clearInterval(interval);
    };

    window.addEventListener("gameOver", gameOverHandler);

    return () => {
      clearInterval(interval);
      window.removeEventListener("gameOver", gameOverHandler);
    };
  }, [isGameStarted, isPaused, setScore]);

  return (
    <div
      className={`absolute top-[30px] right-[50px] text-[#ba9158] text-4xl ${isPaused ? "blink" : ""}`}
    >
      {score}
    </div>
  );
};

export default Timer;
