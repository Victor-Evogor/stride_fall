import {
  useState,
  type FunctionComponent,
  type PropsWithChildren
} from "react";

import { AppContext } from "./AppContext";


const AppProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const [isGameStarted, setisGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false)

  return (
    <AppContext.Provider
      value={{
        isGameStarted,
        setisGameStarted,
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
