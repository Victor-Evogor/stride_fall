import {
  useState,
  type FunctionComponent,
  type PropsWithChildren
} from "react";

import { AppContext } from "./AppContext";


const AppProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const [isGamePlaying, setIsGamePlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false)

  return (
    <AppContext.Provider
      value={{
        isGamePlaying,
        setIsGamePlaying,
        score,
        setScore,
        isPaused,
        setIsPaused
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
