import { useEffect, useRef } from "react";
import Phaser from "phaser";
import GameScene from "../scenes/GameScene";
import { useAppContext } from "../AppContext";
import { type AppContextType } from "../AppContext";
import FontFaceObserver from 'fontfaceobserver';
import { loadGameConfig, saveGameConfig } from "../gameConfig"

const Game = () => {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const ctx = useAppContext();
  const {setIsPaused, isGameStarted, setScore, setIsGameStarted, setIsGameOver, setGameConfig} = ctx
  const gameInitializedRef = useRef(false); // 👈 Prevent double rendering in react devmode with use strict enabled

useEffect(()=>{
    (window as { REACT_CONTEXT?: AppContextType })
          .REACT_CONTEXT = ctx;
  }, [ctx])

  useEffect(() => {
    if (gameInitializedRef.current) return; // 👈 prevent reinitialization
    gameInitializedRef.current = true;

    let game: Phaser.Game | null = null;

    loadGameConfig().then(gameConfig => {
      if(gameConfig){
        setGameConfig(gameConfig)
      } else {
        saveGameConfig({
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
      }
    })

    

    const initGame = () => {
      if (!gameContainerRef.current) return;

      const container = gameContainerRef.current;
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;

                

      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: containerWidth,
        height: containerHeight,
        parent: gameContainerRef.current,
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

    const font = new FontFaceObserver('Pixelify Sans');
    let timeout: number


      font.load().then(() => {
        console.log("font loaded")
        timeout = setTimeout(initGame, 100);
        ;
      }).catch(() => {
        console.warn("Font failed to load, starting game anyway");
        timeout = setTimeout(initGame, 100);
        
      });

    window.addEventListener("restartGame", () => {
      setIsPaused(false)
      setScore(0)
      setIsGameOver(false)
    })

    window.addEventListener("endGame", () => {
      setIsPaused(false)
      setScore(0)
      setIsGameStarted(false)
      setIsGameOver(false)
    })

    window.addEventListener("gameOver", () => {
      setIsPaused(true);
      setIsGameOver(true);
    })

    return () => {
      clearTimeout(timeout);
      if (game) {
        game.destroy(true);
      }
    };
  }, []);



  useEffect(()=>{
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.key === 'p' || event.key === 'P') && isGameStarted) {
          setIsPaused(prev => {
            const nextPaused = !prev;
            window.dispatchEvent(new CustomEvent("pauseGame", {
              detail: { isPaused: nextPaused }
            }));
            return nextPaused;
          });
      }
    };
    

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };

  }, [isGameStarted, setIsPaused])

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
