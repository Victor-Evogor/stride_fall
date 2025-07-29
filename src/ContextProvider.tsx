import {
  useState,
  type FunctionComponent,
  type PropsWithChildren
} from "react";

import { AppContext } from "./AppContext";


const AppProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false)

  return (
    <AppContext.Provider
      value={{
        isGameStarted,
        setIsGameStarted,
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
