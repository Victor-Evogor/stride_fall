import Phaser from "phaser";
import type { AppContextType } from "../AppContext";
import { MOB_SPEEDS, COLUMNS_PER_ROW, DEFAULT_CHARACTER } from "../constants";

import damageBar from "../assets/UI/MinimumDamage/minimum_damage.png";

// -- characters --

// skins
// male
import ivoryMaleCharacter from "../assets/character_assets/male/skin/ivory.png"
import onyxMaleCharacter from "../assets/character_assets/male/skin/onyx.png";
import bronzeMaleCharacter from "../assets/character_assets/male/skin/bronze.png"
import sandstoneMaleCharacter from "../assets/character_assets/male/skin/sandstone.png"
import umberMaleCharacter from "../assets/character_assets/male/skin/umber.png"

// female
import onyxFemaleCharacter from "../assets/character_assets/female/skin/onyx.png"
import ivoryFemaleCharacter from "../assets/character_assets/female/skin/ivory.png"
import bronzeFemaleCharacter from "../assets/character_assets/female/skin/bronze.png"
import sandstoneFemaleCharacter from "../assets/character_assets/female/skin/sandstone.png"
import umberFemaleCharacter from "../assets/character_assets/female/skin/umber.png"

import skyBg from "../assets/background/sky.png";
import texturesSprite from "../assets/Textures-16.png";

// shrubs and trees
import shrubs from "../assets/Trees/shrubs.png";
import tree from "../assets/Trees/all.png";

// bird
import bird from "../assets/bird_fly.png";

// different colors of boars
import blackBoar from "../assets/Mob/Boar/run_vanish_idle_black.png";
import brownBoar from "../assets/Mob/Boar/run_vanish_idle_brown.png";
import whiteBoar from "../assets/Mob/Boar/run_vanish_idle_white.png";

// bee
import bee from "../assets/Mob/small_bee/fly_hit_attack.png";

// snail
import snail from "../assets/Mob/Snail/all.png";

import goldCoin from "../assets/collectibles/gold_coin.png";
import emptyCoin from "../assets/coin_empty.png"

class GameScene extends Phaser.Scene {
  character: Phaser.Physics.Arcade.Sprite | null = null;
  bgElements: Phaser.GameObjects.Image[] = [];
  gameStarted: boolean = false;
  scrollSpeed: number = 0;
  birds: Phaser.GameObjects.Sprite[] = [];
  birdSpeed: number = 50;
  birdSpawnTimer: number = 0;
  nextBirdSpawnDelay: number = 0;
  elapsedTime: number = 0;
  baseScrollSpeed: number = 50;
  maxScrollSpeed: number = 1200;
  scrollAcceleration: number = 0.00003; // tweak for difficulty curve
  platform: Phaser.GameObjects.Rectangle | null = null;
  playerDied: boolean = false;
  groundHeight: number = 0;
  mobs: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody[] = [];
  mobSpawnTimer: number = 0;
  health: number = 8;
  healthBar: Phaser.GameObjects.Sprite | null = null;
  distance: number = 0;
  hasPaintedNewShrub: boolean = false;
  coins: number = 0;
  coinSpawnTimer: number = 0;
  coinsDisplayText: Phaser.GameObjects.Text | null = null;
  armor = 0;
  selectedCharacter = DEFAULT_CHARACTER;

  constructor() {
    super("GameScene");
  }

  init(){
  this.scrollSpeed = 100;
  this.playerDied = false;
  this.mobs = [];
  this.health = 8;
  this.distance = 0;
  this.hasPaintedNewShrub = false;
  this.coins = 0;
  this.coinSpawnTimer = 0;
  this.birdSpawnTimer = 0;
  this.nextBirdSpawnDelay = Phaser.Math.Between(1000, 3000); // spawn delay in ms
  this.birds = []
  this.mobSpawnTimer = 0;
  this.elapsedTime = 0;
  }

  preload() {
    this.load.image("sky", skyBg);
    this.load.spritesheet("shrubs", shrubs, {
      frameWidth: 112,
      frameHeight: 256,
    });
    this.load.spritesheet("tree", tree, {
      frameWidth: 112,
      frameHeight: 366,
    });
    this.load.spritesheet("tiles", texturesSprite, {
      frameWidth: 16,
      frameHeight: 16,
    });

    // Load male characters
    this.load.spritesheet("ivoryMaleCharacter", ivoryMaleCharacter, {
      frameWidth: 80,
      frameHeight: 64,
  });
  this.load.spritesheet("onyxMaleCharacter", onyxMaleCharacter, {
      frameWidth: 80,
      frameHeight: 64,
  });
  this.load.spritesheet("bronzeMaleCharacter", bronzeMaleCharacter, {
      frameWidth: 80,
      frameHeight: 64,
  });
  this.load.spritesheet("sandstoneMaleCharacter", sandstoneMaleCharacter, {
      frameWidth: 80,
      frameHeight: 64,
  });
  this.load.spritesheet("umberMaleCharacter", umberMaleCharacter, {
      frameWidth: 80,
      frameHeight: 64,
  });

  // Load female characters
  this.load.spritesheet("ivoryFemaleCharacter", ivoryFemaleCharacter, {
      frameWidth: 80,
      frameHeight: 64,
  });
  this.load.spritesheet("onyxFemaleCharacter", onyxFemaleCharacter, {
      frameWidth: 80,
      frameHeight: 64,
  });
  this.load.spritesheet("bronzeFemaleCharacter", bronzeFemaleCharacter, {
      frameWidth: 80,
      frameHeight: 64,
  });
  this.load.spritesheet("sandstoneFemaleCharacter", sandstoneFemaleCharacter, {
      frameWidth: 80,
      frameHeight: 64,
  });
  this.load.spritesheet("umberFemaleCharacter", umberFemaleCharacter, {
      frameWidth: 80,
      frameHeight: 64,
  });



    this.load.spritesheet("bird", bird, {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet("blackBoar", blackBoar, {
      frameWidth: 48,
      frameHeight: 32,
    });
    this.load.spritesheet("whiteBoar", whiteBoar, {
      frameWidth: 48,
      frameHeight: 32,
    });
    this.load.spritesheet("brownBoar", brownBoar, {
      frameWidth: 48,
      frameHeight: 32,
    });
    this.load.spritesheet("bee", bee, {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("snail", snail, {
      frameWidth: 48,
      frameHeight: 32,
    });
    this.load.spritesheet("healthBar", damageBar, {
      frameWidth: 64,
      frameHeight: 16,
    });
    this.load.spritesheet("goldCoin", goldCoin, {
      frameWidth: 594,
      frameHeight: 594,
    });
    this.load.image("emptyCoin", emptyCoin);
  }

  create() {
    const width = this.sys.game.config.width as number;
    const height = this.sys.game.config.height as number;

    const bg = this.add.image(0, 0, "sky").setOrigin(0);
    bg.setDisplaySize(width, height);

    const TILE_SCALE = 4;
    const TILE_PIXEL = 16;
    const tileSize = TILE_PIXEL * TILE_SCALE;
    this.groundHeight = height - tileSize * 3;

    const undergroundRows = 2;

    this.birds = [];
    this.birdSpawnTimer = 0;
    this.nextBirdSpawnDelay = Phaser.Math.Between(1000, 3000); // spawn delay in ms

    this.healthBar = this.add
      .sprite(200, 50, "healthBar")
      .setScale(3)
      .setDepth(4);

      

    for (let x = 0; x < Math.ceil(width / tileSize) + 1; x++) {
      const colIndex = Phaser.Math.Between(0, 1);
      const frame = 29 * COLUMNS_PER_ROW + colIndex;

      const tileFrame = this.add
        .image(x * tileSize, this.groundHeight, "tiles", frame)
        .setOrigin(0)
        .setScale(TILE_SCALE)
        .setData("typeOfTile", "soil");

      this.bgElements.push(tileFrame);

      for (let y = 0; y < undergroundRows; y++) {
        const undergroundFrameIndex = (29 + y + 1) * COLUMNS_PER_ROW + colIndex;

        const undergroundTileFrame = this.add
          .image(
            x * tileSize,
            this.groundHeight + (y + 1) * tileSize,
            "tiles",
            undergroundFrameIndex
          )
          .setOrigin(0)
          .setData("typeOfTile", `depth${y + 1}`)
          .setScale(TILE_SCALE);

        this.bgElements.push(undergroundTileFrame);
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
        this.bgElements.push(
          this.add
            .image(treeX, this.groundHeight, "tree", treeFrame)
            .setOrigin(0.5, 1)
            .setScale(1.2)
            .setDepth(0)
            .setData("type", "tree")
        );
      }

      const shrubStartX = treeX - 56;
      const numMiddle = Phaser.Math.Between(1, 2);

      this.bgElements.push(
        this.add
          .image(shrubStartX, this.groundHeight, "shrubs", 0)
          .setOrigin(0, 1)
          .setScale(1.2)
          .setDepth(1)
          .setData("type", "shrub-start")
      ); // shrubs on higher depth

      for (let i = 0; i < numMiddle; i++) {
        this.bgElements.push(
          this.add
            .image(shrubStartX + 112 * (i + 1), this.groundHeight, "shrubs", 1)
            .setOrigin(0, 1)
            .setScale(1.2)
            .setDepth(1)
            .setData("type", "shrub-middle")
        );
      }

      this.bgElements.push(
        this.add
          .image(
            shrubStartX + 112 * (numMiddle + 1),
            this.groundHeight,
            "shrubs",
            2
          )
          .setOrigin(0, 1)
          .setScale(1.2)
          .setDepth(1)
          .setData("type", "shrub-end")
      );

      if (treeInFront) {
        // Draw tree last → in front of shrubs
        this.bgElements.push(
          this.add
            .image(treeX, this.groundHeight, "tree", treeFrame)
            .setOrigin(0.5, 1)
            .setScale(1.2)
            .setDepth(2)
            .setData("type", "tree")
        );
      }
    }

    // --- Animations ---
    

    const characters = [
      "ivoryMaleCharacter",
      "onyxMaleCharacter",
      "bronzeMaleCharacter",
      "sandstoneMaleCharacter",
      "umberMaleCharacter",
      "ivoryFemaleCharacter",
      "onyxFemaleCharacter",
      "bronzeFemaleCharacter",
      "sandstoneFemaleCharacter",
      "umberFemaleCharacter",
  ];

  characters.forEach((character) => {
    this.anims.create({
      key: `${character}-idle`,
      frames: this.anims.generateFrameNumbers(character, {
        start: 0,
        end: 3,
      }),
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
      key: `${character}-jump-rise`,
      frames: this.anims.generateFrameNumbers(character, {
        start: 30,
        end: 33,
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: `${character}-jump-fall`,
      frames: this.anims.generateFrameNumbers(character, {
        start: 40,
        end: 43,
      }),
      frameRate: 8,
      repeat: -1,
    });


      // Walk animation
      this.anims.create({
          key: `${character}-walk`,
          frames: this.anims.generateFrameNumbers(character, {
              start: 10,
              end: 17,
          }),
          frameRate: 10,
          repeat: -1,
      });

      // Run animation
      this.anims.create({
          key: `${character}-run`,
          frames: this.anims.generateFrameNumbers(character, {
              start: 20,
              end: 27,
          }),
          frameRate: 14,
          repeat: -1,
      });

      // Strike animation
      this.anims.create({
          key: `${character}-strike`,
          frames: this.anims.generateFrameNumbers(character, {
              start: 50,
              end: 55,
          }),
          frameRate: 12,
          repeat: 0,
      });

      // Die animation
      this.anims.create({
          key: `${character}-die`,
          frames: this.anims.generateFrameNumbers(character, {
              start: 60,
              end: 69,
          }),
          frameRate: 10,
          repeat: 0,
      });
  });

  // Bird animation
  this.anims.create({
    key: "bird-fly",
    frames: this.anims.generateFrameNumbers("bird", {
      start: 0,
      end: 7,
    }),
    frameRate: 10,
    repeat: -1,
  });

    // 🐌 Snail
    this.anims.create({
      key: "snail-run",
      frames: this.anims.generateFrameNumbers("snail", { start: 0, end: 7 }),
      frameRate: 6,
      repeat: -1,
    });
    this.anims.create({
      key: "snail-hide",
      frames: this.anims.generateFrameNumbers("snail", { start: 8, end: 15 }),
      frameRate: 8,
      repeat: 0,
    });
    this.anims.create({
      key: "snail-comeout",
      frames: this.anims.generateFrameNumbers("snail", { start: 16, end: 23 }),
      frameRate: 8,
      repeat: 0,
    });
    this.anims.create({
      key: "snail-die",
      frames: this.anims.generateFrameNumbers("snail", { start: 24, end: 31 }),
      frameRate: 10,
      repeat: 0,
    });
    this.anims.create({
      key: "snail-idle",
      frames: [{ key: "snail", frame: 32 }],
      frameRate: 1,
      repeat: -1,
    });

    // 🐝 Bee
    this.anims.create({
      key: "bee-fly",
      frames: this.anims.generateFrameNumbers("bee", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "bee-die",
      frames: this.anims.generateFrameNumbers("bee", { start: 4, end: 7 }),
      frameRate: 10,
      repeat: 0,
    });
    this.anims.create({
      key: "bee-attack",
      frames: this.anims.generateFrameNumbers("bee", { start: 8, end: 11 }),
      frameRate: 10,
      repeat: -1,
    });

    // 🐗 Boars (brown, black, white use same frames)
    ["brownBoar", "blackBoar", "whiteBoar"].forEach((key) => {
      this.anims.create({
        key: `${key}-run`,
        frames: this.anims.generateFrameNumbers(key, { start: 0, end: 5 }),
        frameRate: 8,
        repeat: -1,
      });
      this.anims.create({
        key: `${key}-die`,
        frames: this.anims.generateFrameNumbers(key, { start: 6, end: 9 }),
        frameRate: 8,
        repeat: 0,
      });
      this.anims.create({
        key: `${key}-idle`,
        frames: this.anims.generateFrameNumbers(key, { start: 12, end: 15 }),
        frameRate: 2,
        repeat: -1,
      });
    });

    [7, 6, 5, 4, 3, 2, 1, 0].forEach((healthStatus, index) => {
      this.anims.create({
        key: `health-${healthStatus}`,
        frames: this.anims.generateFrameNumbers("healthBar", {
          start: 2 + 6 * index,
          end: 2 + 6 * index + 5,
        }),
        frameRate: 2,
        repeat: 0,
      });
    });

    this.anims.create({
      key: "coin-idle",
      frames: this.anims.generateFrameNumbers("goldCoin", { start: 0, end: 9 }),
      frameRate: 6,
      repeat: -1,
    });

    this.add.sprite(130, 110, "emptyCoin")
      .setScale(0.08)
      .setDepth(4)
      .setOrigin(0.5, 0.5)
    
      this.coinsDisplayText = this.add.text(155, 127, `x ${this.coins}`, {
        fontFamily: 'Pixelify Sans',
        fontSize: '2rem',
        color: '#ba9158',
        
      }).setOrigin(0, 1)
      .setDepth(5)

    this.character = this.physics.add
      .sprite(100, this.groundHeight, this.selectedCharacter)
      .setOrigin(0.5, 1)
      .setScale(2.5)
      .setFlipX(true)
      .setDepth(3)
      .setCollideWorldBounds(true);

    if (this.character && this.character.body) {
      this.character.body.setSize(16, 43);
      this.character.body.setOffset(32, 20);
      this.character.play(`${this.selectedCharacter}-idle`);
    }

    this.platform = this.add
      .rectangle(width / 2, this.groundHeight, width * 3, 16, 0x000000, 0)
      .setOrigin(0.5, 0);
    this.physics.add.existing(this.platform, true);
    this.physics.add.collider(this.character, this.platform);

    this.input.keyboard?.on("keydown-SPACE", () => {
      if (
        this.character &&
        this.character.body &&
        this.gameStarted &&
        !this.playerDied
      ) {
        const body = this.character.body as Phaser.Physics.Arcade.Body;
        if (body.blocked.down) {
          this.character.setVelocityY(-500);
        }
      }
    });

    

    const reactCtx = (window as { REACT_CONTEXT?: AppContextType })
      .REACT_CONTEXT;

    if (reactCtx?.isGameStarted && !this.gameStarted) {
      this.character.play(`${this.selectedCharacter}-walk`);
      this.gameStarted = true;
    }

    window.addEventListener("pauseGame", (event) => {
      if ((event as CustomEvent).detail.isPaused) {
        this.scene.pause();
      } else {
        this.scene.resume();
      }
    });

    window.addEventListener("restartGame", () => {
      this.scene.restart();
    })

    window.addEventListener("endGame", () => {
      this.scene.restart();
    })

    // this.physics.world.createDebugGraphic(); // Uncomment this for debugging
  }

  update(_: number, delta: number) {
    if ((window as { REACT_CONTEXT?: AppContextType }).REACT_CONTEXT)
      this.gameStarted = (
        window as { REACT_CONTEXT?: AppContextType }
      ).REACT_CONTEXT!.isGameStarted;
    if (!this.character) return;

    const body = this.character.body as Phaser.Physics.Arcade.Body;

    const reactCtx = (window as { REACT_CONTEXT?: AppContextType })
      .REACT_CONTEXT;
    if (reactCtx) {
      this.distance = reactCtx.score;
    }

    if (
      body.velocity.y < -10 &&
      !body.blocked.down &&
      this.gameStarted &&
      !this.playerDied
    ) {
      this.character.play(`${this.selectedCharacter}-jump-rise`);
    } else if (
      body.velocity.y > 10 &&
      !body.blocked.down &&
      this.gameStarted &&
      !this.playerDied
    ) {
      this.character.play(`${this.selectedCharacter}-jump-fall`);
    } else if (body.blocked.down && this.gameStarted && !this.playerDied) {
      // Only play walk or run when grounded and not already playing
      if (this.scrollSpeed > 250 && this.character.anims.getName() !== `${this.selectedCharacter}-run`) {
        this.character.play(`${this.selectedCharacter}-run`);
      } else if (
        this.scrollSpeed <= 250 &&
        this.character.anims.getName() !== `${this.selectedCharacter}-walk`
      ) {
        this.character.play(`${this.selectedCharacter}-walk`);
      }
    }

    if (this.gameStarted) {
      // Scroll background
      this.elapsedTime += delta;

      // Use a curve to increase speed
      // Formula: speed = base + (max - base) * (1 - e^(-k * time))
      const t = this.elapsedTime;
      const k = this.scrollAcceleration;
      const max = this.maxScrollSpeed;
      const base = this.baseScrollSpeed;

      if (!this.playerDied)
        this.scrollSpeed = base + (max - base) * (1 - Math.exp(-k * t));
      else this.scrollSpeed = 0;

      this.bgElements.forEach((obj) => {
        obj.x -= this.scrollSpeed * (delta / 1000);

        if (obj.x + obj.displayWidth < 0) {
          obj.x += (this.sys.game.config.width as number) + obj.displayWidth;
          if (obj.getData("typeOfTile")) {
            const typeOfTile = obj.getData("typeOfTile") as
              | "soil"
              | "depth1"
              | "depth2";
            obj.setFrame(this.getTileFrameByDistance(typeOfTile));
          } else if (obj.getData("type") === "tree") {
            obj.setFrame(this.getTreeFrameByDistance());
          } else if (obj.getData("type") === "shrub-start") {
            obj.setFrame(this.getShrubFrameByDistance("shrub-start"));
          } else if (obj.getData("type") === "shrub-middle") {
            obj.setFrame(this.getShrubFrameByDistance("shrub-middle"));
          } else if (obj.getData("type") === "shrub-end") {
            obj.setFrame(this.getShrubFrameByDistance("shrub-end"));
          }
        }
      });

      // --- MOB MOVEMENT ---
      this.mobs = this.mobs.filter((mob) => {
        if (
          (!this.playerDied && !mob.getData("isKillerMob")) ||
          (mob.getData("type") == "bee" &&
            this.playerDied &&
            mob.getData("isKillerMob"))
        )
          mob.x -=
            mob.getData("speed") * (delta / 1000) +
            this.scrollSpeed * (delta / 1000);
        else if (mob.getData("isKillerMob")) {
          mob.x -= 0;
        } else mob.x -= mob.getData("speed") * (delta / 1000);
        if (mob.x < -100) {
          mob.destroy();
          return false;
        }
        return true;
      });

      // --- MOB SPAWNING ---
      if (!this.playerDied) {
        this.mobSpawnTimer += delta;
        if (this.mobSpawnTimer >= this.getSpawnInterval()) {
          this.mobSpawnTimer = 0;
          const type = this.selectMobTypeByDistance();
          this.spawnMob(type);
        }
      }

      // -- Collectible spawning --

      if(!this.playerDied){
        this.coinSpawnTimer += delta;
        if(this.coinSpawnTimer >= this.getSpawnCollectibleInterval() && this.shouldSpawnCollectible()){
          this.coinSpawnTimer = 0;
          this.spawnColletible("coin")
        }
      }

      // update coin balance

      if(this.coinsDisplayText)
      this.coinsDisplayText.setText(`x ${this.coins}`);
    }

    // update birds
    // Move birds and remove off-screen ones
    this.birds = this.birds.filter((bird) => {
      const scrollOffset = this.gameStarted ? this.scrollSpeed * 0.3 : 0;
      bird.x -= (this.birdSpeed + scrollOffset) * (delta / 1000);

      if (bird.x < -50) {
        bird.destroy();
        return false; // remove from array
      }
      return true;
    });

    // Handle random bird spawning
    this.birdSpawnTimer += delta;
    if (this.birdSpawnTimer >= this.nextBirdSpawnDelay) {
      this.spawnSingleBird();
      this.birdSpawnTimer = 0;
      this.nextBirdSpawnDelay = Phaser.Math.Between(6_000, 70_000); // next delay
    }
  }

  spawnSingleBird() {
    const screenWidth = this.sys.game.config.width as number;
    const birdY = Phaser.Math.Between(50, 150); // different heights

    const bird = this.add
      .sprite(screenWidth + 50, birdY, "bird")
      .setScale(2)
      .setOrigin(0.5, 0.5)
      .setDepth(0)
      .setFlipX(true);

    bird.play("bird-fly");
    this.birds.push(bird);
  }

  spawnMob(type: "snail" | "bee" | "boar") {
    if (!this.platform || !this.character) return;
    const x = (this.sys.game.config.width as number) + 0;
    const groundY = this.groundHeight;
    let mob: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | null = null;

    if (type === "snail") {
      mob = this.physics.add.sprite(x, groundY, "snail"); // or 'boar-brown'
      mob.setOrigin(0.5, 1);
      mob.play("snail-run");
      this.physics.add.collider(mob, this.platform);
      mob.play("snail-run");
      mob.setScale(2.5);
      mob.setSize(19, 20);
      mob.body.setOffset(19, 12);
      mob.setData("speed", MOB_SPEEDS.snail);
    } else if (type === "bee") {
      mob = this.physics.add
        .sprite(x, this.groundHeight - 100, "bee")
        .setOrigin(0.5, 1);
      mob.play("bee-fly");
      mob.body.setAllowGravity(false);
      mob.setScale(1.5);
      mob.setSize(19, 24);
      mob.body.setOffset(22, 21);
      mob.setData("speed", MOB_SPEEDS.bee);
    } else if (type === "boar") {
      const boarColors = ["brownBoar", "blackBoar", "whiteBoar"];
      const selected = Phaser.Utils.Array.GetRandom(boarColors);
      mob = this.physics.add.sprite(x, groundY, selected).setOrigin(0.5, 1);
      this.physics.add.collider(mob, this.platform);
      mob.setData("boarType", selected);
      mob.play(`${selected}-run`);
      mob.setScale(2.5);
      mob.setSize(30, 26);
      mob.body.setOffset(6, 6);
      mob.setData("speed", MOB_SPEEDS.boar);
    }

    if (!mob) throw new Error("Mob type " + type + " not known");

    // mob.setVelocityX(-(mob.getData("speed")));
    mob.setData("type", type);
    mob.setData("isKillerMob", false);
    mob.setDepth(4)
    .setAlpha(1).setVisible(true)
    ;
    this.mobs.push(mob);
    this.physics.add.overlap(this.character, mob, () =>
    {
      this.handleMobCollision(mob)

    }
    );
  }

  handleMobCollision(mob: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) {
    // const type = mob.getData("type");
    if (!this.character || this.playerDied) return;

    this.health--;
    this.updateHealthBarGui(this.health);

    if (this.health <= 0) {
      this.playerDied = true;
      this.killPlayer(mob);
      mob.setData("isKillerMob", true);
      return;
    }

    // Mob death logic (only if player survived)
    mob.body.enable = false;
    mob.destroy();

    // Flash red
    this.character.setTint(0xff0000);
    this.tweens.add({
      targets: this.character,
      alpha: 0.2,
      ease: "Linear",
      duration: 100,
      yoyo: true,
      repeat: 3,
      onComplete: () => {
        this.character!.clearTint();
        this.character!.setAlpha(1);
      },
    });
  }

  killPlayer(killerMob: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) {
    if (!this.character) return;
    this.character.play(`${this.selectedCharacter}-die`);
    this.scrollSpeed = 0;
    this.playerDied = true;

    const type = killerMob.getData("type");

    if (type === "snail") {
      killerMob.play("snail-hide");
      this.time.delayedCall(2000, () => {
        killerMob.play("snail-comeout");
      });
    } else if (type === "boar") {
      const boarType = killerMob.getData("boarType");
      killerMob.play(`${boarType}-idle`);
    } else if (type === "bee") {
      killerMob.play("bee-fly");
    }
    setTimeout(()=>{
      window.dispatchEvent(
        new CustomEvent("gameOver", { detail: { health: this.health } })
      );
    }, 3_000)
  }

  getSpawnInterval(): number {
    const baseInterval = 3000; // starting interval in ms
    const minInterval = 700; // don't go lower than this
    const decayRate = 0.008; // controls how quickly it speeds up

    const interval = baseInterval * Math.exp(-decayRate * this.distance);
    return Math.max(interval, minInterval);
  }

  selectMobTypeByDistance(): "snail" | "bee" | "boar" {
    const r = Math.random() * 100;

    if (this.distance < 30) {
      return "snail";
    }

    if (this.distance < 60) {
      // 70% snail, 30% bee
      return r < 70 ? "snail" : "bee";
    }

    if (this.distance < 100) {
      // 50% snail, 50% bee
      return r < 50 ? "snail" : "bee";
    }

    if (this.distance < 130) {
      // 20% snail, 80% bee
      return r < 20 ? "snail" : "bee";
    }

    if (this.distance < 180) {
      // 30% boar, 10% snail, 60% bee
      if (r < 30) return "boar";
      if (r < 40) return "snail"; // 30–40 = 10%
      return "bee"; // 40–100 = 60%
    }

    if (this.distance < 220) {
      // 50% boar, 20% snail, 30% bee
      if (r < 50) return "boar";
      if (r < 70) return "bee"; // 50–70 = 20%
      return "snail"; // 70–100 = 30%
    }

    if (this.distance < 250) {
      // 70% boar, 20% bee, 10% snail
      if (r < 70) return "boar";
      if (r < 90) return "bee"; // 70–90 = 20%
      return "snail"; // 90–100 = 10%
    }

    // 300 and above
    // 80% boar, 15% bee, 5% snail
    if (r < 80) return "boar";
    if (r < 95) return "bee";
    return "snail";
  }

  updateHealthBarGui(health: number) {
    if (!this.healthBar) return;
    this.healthBar.play(`health-${health}`);
  }

  getTileFrameByDistance(typeOfTile: "soil" | "depth1" | "depth2") {
    let colIndex = 0;
    if (this.distance < 50) {
      colIndex = Phaser.Math.Between(0, 1);
    } else if (this.distance < 100) {
      colIndex = Phaser.Math.Between(2, 3);
    } else if (this.distance < 150) {
      colIndex = Phaser.Math.Between(4, 5);
    } else if (this.distance < 200) {
      colIndex = Phaser.Math.Between(6, 7);
    } else if (this.distance < 250) {
      colIndex = Phaser.Math.Between(8, 9);
    } else if (this.distance < 300) {
      colIndex = Phaser.Math.Between(10, 11);
    } else {
      colIndex = Phaser.Math.Between(12, 13);
    }

    if (typeOfTile === "soil") {
      return 29 * COLUMNS_PER_ROW + colIndex;
    } else if (typeOfTile === "depth1") {
      return (29 + 1) * COLUMNS_PER_ROW + colIndex;
    } else if (typeOfTile === "depth2") {
      return (29 + 2) * COLUMNS_PER_ROW + colIndex;
    } else {
      throw new Error("Unknown type of tile: " + typeOfTile);
    }
  }

  getTreeFrameByDistance() {
    if (this.distance < 50) {
      return Phaser.Math.Between(0, 3);
    } else if (this.distance < 100) {
      return Phaser.Math.Between(4, 7);
    } else if (this.distance < 300) {
      return Phaser.Math.Between(8, 11);
    } else if (this.distance < 400) {
      return Phaser.Math.Between(12, 15);
    } else {
      return Phaser.Math.Between(16, 19);
    }
  }

  getShrubFrameByDistance(
    typeOfShrub: "shrub-start" | "shrub-middle" | "shrub-end"
  ) {
    const colIndex =
      typeOfShrub === "shrub-start"
        ? 0
        : typeOfShrub === "shrub-middle"
        ? 1
        : 2;
    if (this.distance < 250) {
      return colIndex;
    } else {
      if (this.hasPaintedNewShrub || typeOfShrub === "shrub-start") {
        this.hasPaintedNewShrub = true;
        return colIndex + 3;
      }
      return colIndex;
    }
  }

  spawnColletible(type: "coin" | "heart") {
    if(!this.character) throw new Error("Character not found!");
    const x = (this.sys.game.config.width as number) + 0;
    const y = this.groundHeight -( Phaser.Math.Between(0, 1)?50: 140);
    let collectible: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | null =
      null;

    if (type === "coin") {
      collectible = this.physics.add.sprite(x, y, "coin")
      .setSize(563, 564)
      .setScale(0.05)
      .setOffset(64, 44)
      ;
      collectible.play("coin-idle")
    }/*  else if(type === "heart"){

    }  */else {
      throw new Error("Collectible "+type+" not found!")
    }
    collectible.setDepth(3)
    collectible.body.setAllowGravity(false)
    this.bgElements.push(collectible)
    this.physics.add.overlap(this.character, collectible, () =>
      this.handleCollectibleCollision(collectible)
    );
  }


  handleCollectibleCollision(collectible:Phaser.Types.Physics.Arcade.SpriteWithDynamicBody){
    if (!this.character || this.playerDied) return;

    if (collectible.texture.key === "goldCoin") {
      this.coins++;
      collectible.destroy();
      this.spawnColletible("coin");
      window.dispatchEvent(
        new CustomEvent("collectibleCollected", { detail: { type: "coin" } })
      );
    } else if (collectible.texture.key === "heart") {
      // Handle heart collectible
      collectible.destroy();
      this.health = Math.min(this.health + 1, 8);
      this.updateHealthBarGui(this.health);
      window.dispatchEvent(
        new CustomEvent("collectibleCollected", { detail: { type: "heart" } })
      );
    }
  }

  getSpawnCollectibleInterval(): number {
    const baseInterval = 5000; // Start slow
    const minInterval = 2000; // Never go below this
    const decayRate = 0.006;  // Lower = slower decay
    const randomness = Phaser.Math.Between(-400, 400); // Add jitter
  
    const interval = baseInterval * Math.exp(-decayRate * this.distance);
    const noisyInterval = Math.max(minInterval, interval + randomness);
  
    return noisyInterval;
  }
  

  shouldSpawnCollectible(): boolean {
    const baseChance = 0.04;
    const chance = baseChance + (this.distance / 100000); // increase over time
    return Math.random() < Math.min(chance, 0.3); // max 30% chance
  }


}

export default GameScene;
