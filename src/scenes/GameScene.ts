import Phaser from "phaser";
import skyBg from "../assets/background/sky.png";
import texturesSprite from "../assets/Textures-16.png";
import onyxMaleCharacter from "../assets/character_assets/male/skin/onyx.png";
import shrubs from "../assets/Trees/shrubs.png"
import greenTree from "../assets/Trees/two_green_tall_trees.png"


class GameScene extends Phaser.Scene {
    character: Phaser.Physics.Arcade.Sprite | null = null; 

    constructor() {
      super("GameScene");
    }

    preload() {
      this.load.image("sky", skyBg);
      this.load.spritesheet("shrubs", shrubs, {
        frameWidth: 112,
        frameHeight: 256
      })
      this.load.spritesheet("greenTree", greenTree, {
        frameWidth: 112,
        frameHeight: 366 // two trees
      })
      this.load.spritesheet("tiles", texturesSprite, {
        frameWidth: 16,
        frameHeight: 16,
      });
      this.load.spritesheet("onyxMaleCharacter", onyxMaleCharacter, {
        frameWidth: 80,
        frameHeight: 64,
      });
    }

    create() {
      const width = this.sys.game.config.width as number;
      const height = this.sys.game.config.height as number;
    
      const bg = this.add.image(0, 0, "sky").setOrigin(0);
      bg.setDisplaySize(width, height);
    
      const TILE_SCALE = 4;
      const TILE_PIXEL = 16;
      const tileSize = TILE_PIXEL * TILE_SCALE;
      const groundHeight = height - tileSize * 4;
      const COLUMNS_PER_ROW = 32;
      const undergroundRows = 3;
    
      const getRandomColumnIndex = () => {
        const r = Math.random();
        if (r < 0.85) return Phaser.Math.Between(0, 5);
        else if (r < 0.9) return 7;
        else if (r < 0.9998) return Phaser.Math.Between(8, 9);
        else return Phaser.Math.Between(10, 13);
      };
    
      for (let x = 0; x < Math.ceil(width / tileSize); x++) {
        const colIndex = getRandomColumnIndex();
        const frame = 29 * COLUMNS_PER_ROW + colIndex;
    
        this.add
          .image(x * tileSize, groundHeight, "tiles", frame)
          .setOrigin(0)
          .setScale(TILE_SCALE);
    
        for (let y = 1; y <= undergroundRows; y++) {
          const undergroundFrameIndex =
            y === undergroundRows
              ? (29 + y - 1) * COLUMNS_PER_ROW + Phaser.Math.Between(6, 13)
              : (29 + y) * COLUMNS_PER_ROW + Phaser.Math.Between(0, 1);
    
          this.add
            .image(
              x * tileSize,
              groundHeight + y * tileSize,
              "tiles",
              undergroundFrameIndex
            )
            .setOrigin(0)
            .setScale(TILE_SCALE);
        }
      }
    
      // --- Place background trees and shrubs ---
      const objectSpacing = 250;
for (let x = 0; x < width; x += objectSpacing) {
  const treeX = x + Phaser.Math.Between(0, 80);
  const treeFrame = Phaser.Math.Between(0, 3);
  const treeInFront = Math.random() < 0.5; // 50% chance tree is in front

  if (!treeInFront) {
    // Draw tree first → behind shrubs
    this.add.image(treeX, groundHeight, 'greenTree', treeFrame)
      .setOrigin(0.5, 1)
      .setScale(1.2)
      .setDepth(0);
  }

    const shrubStartX = treeX - 56;
    const numMiddle = Phaser.Math.Between(1, 2);

    this.add.image(shrubStartX, groundHeight, 'shrubs', 0)
      .setOrigin(0, 1)
      .setScale(1.2)
      .setDepth(1); // shrubs on higher depth

    for (let i = 0; i < numMiddle; i++) {
      this.add.image(shrubStartX + 112 * (i + 1), groundHeight, 'shrubs', 1)
        .setOrigin(0, 1)
        .setScale(1.2)
        .setDepth(1);
    }

    this.add.image(shrubStartX + 112 * (numMiddle + 1), groundHeight, 'shrubs', 2)
      .setOrigin(0, 1)
      .setScale(1.2)
      .setDepth(1);

  if (treeInFront) {
    // Draw tree last → in front of shrubs
    this.add.image(treeX, groundHeight, 'greenTree', treeFrame)
      .setOrigin(0.5, 1)
      .setScale(1.2)
      .setDepth(2);
  }
}


    
      // --- Animations ---
      this.anims.create({
        key: "idle",
        frames: this.anims.generateFrameNumbers("onyxMaleCharacter", {
          start: 0,
          end: 3,
        }),
        frameRate: 6,
        repeat: -1,
      });
    
      this.anims.create({
        key: "jump-rise",
        frames: this.anims.generateFrameNumbers("onyxMaleCharacter", {
          start: 30,
          end: 33,
        }),
        frameRate: 8,
        repeat: -1,
      });
    
      this.anims.create({
        key: "jump-fall",
        frames: this.anims.generateFrameNumbers("onyxMaleCharacter", {
          start: 40,
          end: 43,
        }),
        frameRate: 8,
        repeat: -1,
      });
    
    
      this.character = this.physics.add
        .sprite(40, groundHeight, "onyxMaleCharacter")
        .setOrigin(0.5, 1)
        .setScale(2.5)
        .setFlipX(true)
        .setDepth(3)
        .setCollideWorldBounds(true);
      
      if (this.character && this.character.body) {
        this.character.body.setSize(80, 57);
        this.character.body.setOffset(0, 9);
        this.character.play("idle");
      }
    
      const platform = this.add
        .rectangle(width / 2, groundHeight + 8, width, 16, 0x000000, 0)
        .setOrigin(0.5, 0);
      this.physics.add.existing(platform, true);
      this.physics.add.collider(this.character, platform);
    
      this.input.keyboard?.on("keydown-SPACE", () => {
        if (this.character && this.character.body) {
          const body = this.character.body as Phaser.Physics.Arcade.Body;
          if (body.blocked.down) {
            this.character.setVelocityY(-500);
          }
        }
      });
    }
    

    update() {
        if (!this.character) return;
      
        const body = this.character.body as Phaser.Physics.Arcade.Body;
      
        if (body.velocity.y < -10 && !body.blocked.down) {
          this.character.play('jump-rise', true);
        } else if (body.velocity.y > 10 && !body.blocked.down) {
          this.character.play('jump-fall', true);
        } else if (body.blocked.down) {
          this.character.play('idle', true);
        }
      }
    }


export default GameScene