import { useEffect, useRef } from "react";
import Phaser from "phaser";
import GameScene from "../scenes/GameScene";
import { useAppContext } from "../AppContext";
import { type AppContextType } from "../AppContext";
import FontFaceObserver from "fontfaceobserver";
import { loadGameConfig, saveGameConfig } from "../gameConfig";

const Game = () => {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const ctx = useAppContext();
  const {
    setIsPaused,
    isGameStarted,
    setScore,
    setIsGameStarted,
    setIsGameOver,
    setGameConfig,
  } = ctx;
  const gameInitializedRef = useRef(false); // 👈 Prevent double rendering in react devmode with use strict enabled

  useEffect(() => {
    (window as { REACT_CONTEXT?: AppContextType }).REACT_CONTEXT = ctx;
  }, [ctx]);

  useEffect(() => {
    if (gameInitializedRef.current) return; // 👈 prevent reinitialization
    gameInitializedRef.current = true;

    let game: Phaser.Game | null = null;

    loadGameConfig().then((gameConfig) => {
      if (gameConfig) {
        setGameConfig(gameConfig);
      } else {
        saveGameConfig({
          armor: 0,
          coins: 0,
          highScore: 0,
          ownedItems: [
            "Female Black hair",
            "Female Blonde hair",
            "Female Brown hair",
            "Female Golden hair",
            "Female Red hair",
            "Male Black hair",
            "Male Blonde hair",
            "Male Brown hair",
            "Male Golden hair",
            "Male Red hair",
          ],
          pet: null,
          characterGender: "female",
          selectedCharacter: "sandstoneFemaleCharacter",
          clothing: {
            hat: null,
            footwear: null,
            outfit: null,
            skirt: null,
          },
          hand: null,
          hair: null,
          petAccessory: null,
        });
      }
    });

    const initGame = () => {
      if (!gameContainerRef.current) return;

      const container = gameContainerRef.current;
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;

      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: containerWidth,
        height: containerHeight,
        parent: container,
        scene: GameScene,
        physics: {
          default: "arcade",
          arcade: {
            gravity: { y: 1000, x: 0 },
            debug: false,
          },
        },

        scale: {
          mode: Phaser.Scale.RESIZE,
          autoCenter: Phaser.Scale.CENTER_BOTH,
        },
        render: {
          antialias: false,
          pixelArt: true,
        },
      };

      game = new Phaser.Game(config);
    };

    const font = new FontFaceObserver("Pixelify Sans");
    let timeout: number;

    font
      .load()
      .then(() => {
        console.log("font loaded");
        timeout = setTimeout(initGame, 100);
      })
      .catch(() => {
        console.warn("Font failed to load, starting game anyway");
        timeout = setTimeout(initGame, 100);
      });

    const handleRestartGame = () => {
      setIsPaused(false);
      setScore(0);
      setIsGameOver(false);
    };

    const handleEndGame = () => {
      setIsPaused(false);
      setScore(0);
      setIsGameStarted(false);
      setIsGameOver(false);
    };

    const handleGameOver: EventListenerOrEventListenerObject = (
      gameDetails
    ) => {
      setGameConfig((prev) => {
        saveGameConfig({
          ...prev,
          coins:
            prev.coins + (gameDetails as CustomEvent).detail.coinsCollected,
          highScore: Math.max(
            prev.highScore,
            (gameDetails as CustomEvent).detail.score
          ),
        });
        return {
          ...prev,
          coins:
            prev.coins + (gameDetails as CustomEvent).detail.coinsCollected,
          highScore: Math.max(
            prev.highScore,
            (gameDetails as CustomEvent).detail.score
          ),
        };
      });
      setIsPaused(true);
      setIsGameOver(true);
    };

    window.addEventListener("restartGame", handleRestartGame);

    window.addEventListener("endGame", handleEndGame);

    window.addEventListener("gameOver", handleGameOver);

    return () => {
      clearTimeout(timeout);
      if (game) {
        game.destroy(true);
      }
      window.removeEventListener("restartGame", handleRestartGame);
      window.removeEventListener("endGame", handleEndGame);
      window.removeEventListener("gameOver", handleGameOver);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.key === "p" || event.key === "P") && isGameStarted) {
        setIsPaused((prev) => {
          const nextPaused = !prev;
          window.dispatchEvent(
            new CustomEvent("pauseGame", {
              detail: { isPaused: nextPaused },
            })
          );
          return nextPaused;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isGameStarted, setIsPaused]);

  return (
    <div className="w-full h-full">
      <div
        ref={gameContainerRef}
        className="w-full h-full"
        style={{
          touchAction: "none",
          userSelect: "none",
        }}
      />
    </div>
  );
};

export default Game;
