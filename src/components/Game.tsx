import { useEffect, useRef } from "react";
import Phaser from "phaser";
import GameScene from "../scenes/GameScene";
// import rocks from "../assets/bg_assets/Props-Rocks.png"  

const Game = () => {
  const gameContainerRef = useRef<HTMLDivElement>(null);

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
