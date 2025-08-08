import {
  useState,
  type FunctionComponent,
  type PropsWithChildren
} from "react";

import { AppContext } from "./AppContext";
import { type GameConfigType } from "./gameConfig";


const AppProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false)
  const [isGameOver, setIsGameOver] = useState(false);
  const [isCharacterCustomizeMenuOpen, setIsCharacterCustomizeMenuOpen] = useState<boolean>(false)
  const [gameConfig, setGameConfig] = useState<GameConfigType>({
    armor: 0,
    coins: 0,
    highScore: 0,
    ownedItems: [],
    pet: null,
    characterGender: "female",
    selectedCharacter: "sandstoneFemaleCharacter",
    clothing: {
      hat: null,
      topBottom: null,
      shoes: null,
    },
    hand: null,
    hair: null,
    petAccessory: null,
  })

  return (
    <AppContext.Provider
      value={{
        isGameStarted,
        setIsGameStarted,
        score,
        setScore,
        isPaused,
        setIsPaused,
        isGameOver,
        setIsGameOver,
        gameConfig,
        isCharacterCustomizeMenuOpen,
        setIsCharacterCustomizeMenuOpen,
        setGameConfig
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
