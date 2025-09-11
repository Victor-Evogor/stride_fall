import {
  useState,
  type FunctionComponent,
  type PropsWithChildren,
} from "react";

import { AppContext } from "./AppContext";
import { type GameConfigType } from "./gameConfig";

const AppProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isCharacterCustomizeMenuOpen, setIsCharacterCustomizeMenuOpen] =
    useState<boolean>(false);
  const [gameConfig, setGameConfig] = useState<GameConfigType>({
    armor: 0,
    coins: 0,
    highScore: 0,
    ownedItems: [
      "Female Black hair",
      "Female Blonde hair",
      "Female Brown hair",
      "Female Golden hair",
      "Female Red hair",
      "Male Black hair"
  , "Male Blonde hair"
  , "Male Brown hair"
  , "Male Golden hair"
  , "Male Red hair"
    ],
    pet: null,
    characterGender: "female",
    selectedCharacter: "sandstoneFemaleCharacter",
    clothing: {
      hat: null,
      footwear: null,
      outfit: null,
      skirt: null
    },
    hand: null,
    hair: null,
    petAccessory: null,
  });
  const [isInfoMenuOpen, setIsInfoMenuOpen] = useState(false)

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
        setGameConfig,
        isInfoMenuOpen,
        setIsInfoMenuOpen
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
