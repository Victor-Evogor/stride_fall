import { useEffect } from "react";
import { useAppContext } from "../AppContext";

const Timer = () => {
  const { score, isGamePlaying, setScore } = useAppContext();

  useEffect(() => {
    let interval = 0;
    if (isGamePlaying) {
      interval = setInterval(() => {
        setScore((prevScore) => prevScore + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isGamePlaying, setScore]);

  return (
    <div className="absolute top-[30px] right-[50px] text-[#ba9158] text-4xl">
      {score}
    </div>
  );
};

export default Timer;