import {
  useState,
  type FunctionComponent,
  type PropsWithChildren
} from "react";

import { AppContext } from "./AppContext";


const AppProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const [isGamePlaying, setIsGamePlaying] = useState(false);
  const [score, setScore] = useState(0);
  

  return (
    <AppContext.Provider
      value={{
        isGamePlaying,
        setIsGamePlaying,
        score,
        setScore
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
