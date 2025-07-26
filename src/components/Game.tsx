import { useEffect, useRef } from "react";
import Phaser from "phaser";
import GameScene from "../scenes/GameScene";
import { useAppContext } from "../AppContext";
import { type AppContextType } from "../AppContext";

const Game = () => {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const ctx = useAppContext();
  const {setIsPaused, isGamePlaying} = ctx

useEffect(()=>{
    (window as { REACT_CONTEXT?: AppContextType })
          .REACT_CONTEXT = ctx;
  }, [ctx])

  useEffect(() => {

    let game: Phaser.Game | null = null;

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

    const handleResize = () => {
      if (game && gameContainerRef.current) {
        const container = gameContainerRef.current;
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        game.scale.resize(containerWidth, containerHeight);
      }
    };

    const timeout = setTimeout(initGame, 100);
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", () =>
      setTimeout(handleResize, 100)
    );

    

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
      if (game) {
        game.destroy(true);
      }
    };
  }, []);

  useEffect(()=>{
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.key === 'p' || event.key === 'P') && isGamePlaying) {
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

  }, [isGamePlaying])

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
