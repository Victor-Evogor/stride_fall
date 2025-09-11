import {
    createContext,
    useContext,
    type Dispatch,
    type SetStateAction,
  } from "react";
import { type GameConfigType } from "./gameConfig";

export interface AppContextType {
  isGameStarted: boolean;
  setIsGameStarted: Dispatch<SetStateAction<boolean>>;
  score:number;
  setScore: Dispatch<SetStateAction<number>>;
  isPaused: boolean,
  setIsPaused: Dispatch<SetStateAction<boolean>>;
  isGameOver: boolean;
  setIsGameOver: Dispatch<SetStateAction<boolean>>;
  gameConfig: GameConfigType;
  setGameConfig: Dispatch<SetStateAction<GameConfigType>>;
  isCharacterCustomizeMenuOpen: boolean;
  setIsCharacterCustomizeMenuOpen: Dispatch<SetStateAction<boolean>>;
  isInfoMenuOpen: boolean;
  setIsInfoMenuOpen: Dispatch<SetStateAction<boolean>>;
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