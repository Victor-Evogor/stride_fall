import {
    createContext,
    useContext,
    type Dispatch,
    type SetStateAction,
  } from "react";

export interface AppContextType {
  isGamePlaying: boolean;
  setIsGamePlaying: Dispatch<SetStateAction<boolean>>;
  score:number;
  setScore: Dispatch<SetStateAction<number>>;
  isPaused: boolean,
  setIsPaused: Dispatch<SetStateAction<boolean>>;
}

export const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
    if (!AppContext) {
        throw new Error("useAppContext must be used within an AppProvider");
    }
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within an AppProvider");
    }
    return context
}