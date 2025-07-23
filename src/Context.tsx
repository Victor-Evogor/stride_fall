import {
  createContext,
  useState,
  type FunctionComponent,
  type PropsWithChildren,
  type Dispatch,
  type SetStateAction,
} from "react";

interface AppContextType {
  isGamePlaying: boolean;
  setIsGamePlaying: Dispatch<SetStateAction<boolean>>;
}

const AppContext = createContext<AppContextType | null>(null);

const AppProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const [isGamePlaying, setIsGamePlaying] = useState(false);
  return (
    <AppContext.Provider
      value={{
        isGamePlaying,
        setIsGamePlaying,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
