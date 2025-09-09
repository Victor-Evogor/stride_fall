import Phaser from "phaser";
import type { AppContextType } from "../AppContext";
import { MOB_SPEEDS, COLUMNS_PER_ROW, DEFAULT_CHARACTER } from "../constants";
import {
  femaleFootwear,
  femaleHair,
  femaleHand,
  femaleOutfit,
  femaleSkirt,
  hats,
  maleBottomClothing,
  maleFootwear,
  maleHair,
  maleHand,
  maleTopClothing,
  petAccessories,
  type PetAccessoriesAssetKeys,
} from "../assetMap";
import damageBar from "../assets/UI/MinimumDamage/minimum_damage.png";

// -- characters --

// skins
// male
import ivoryMaleCharacter from "../assets/character_assets/male/skin/ivory.png";
import onyxMaleCharacter from "../assets/character_assets/male/skin/onyx.png";
import bronzeMaleCharacter from "../assets/character_assets/male/skin/bronze.png";
import sandstoneMaleCharacter from "../assets/character_assets/male/skin/sandstone.png";
import umberMaleCharacter from "../assets/character_assets/male/skin/umber.png";

// female
import onyxFemaleCharacter from "../assets/character_assets/female/skin/onyx.png";
import ivoryFemaleCharacter from "../assets/character_assets/female/skin/ivory.png";
import bronzeFemaleCharacter from "../assets/character_assets/female/skin/bronze.png";
import sandstoneFemaleCharacter from "../assets/character_assets/female/skin/sandstone.png";
import umberFemaleCharacter from "../assets/character_assets/female/skin/umber.png";

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
import emptyCoin from "../assets/coin_empty.png";
import { loadGameConfig, type GameConfigType } from "../gameConfig";
import type { fClothingType, mClothingType } from "../types";

class GameScene extends Phaser.Scene {
  character: Phaser.GameObjects.Sprite | null = null;
  clothing: {
    hat: Phaser.GameObjects.Sprite | null;
    footwear: Phaser.GameObjects.Sprite | null;
    handItem: Phaser.GameObjects.Sprite | null;
    hair: Phaser.GameObjects.Sprite | null;
    fOutfit: Phaser.GameObjects.Sprite | null;
    fSkirt: Phaser.GameObjects.Sprite | null;
    mTop: Phaser.GameObjects.Sprite | null;
    mBottom: Phaser.GameObjects.Sprite | null;
  } | null = {
    hat: null,
    footwear: null,
    handItem: null,
    hair: null,
    fOutfit: null,
    fSkirt: null,
    mTop: null,
    mBottom: null,
  };
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
  assets = [
    femaleFootwear,
    femaleHair,
    femaleHand,
    femaleOutfit,
    femaleSkirt,
    hats,
    maleBottomClothing,
    maleFootwear,
    maleHair,
    maleHand,
    maleTopClothing,
  ];
  selectedCharacter = DEFAULT_CHARACTER;
  characterXOffset = 100;
  playerContainer: Phaser.GameObjects.Container | null = null;

  constructor() {
    super("GameScene");
  }

  init() {
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
    this.birds = [];
    this.mobSpawnTimer = 0;
    this.elapsedTime = 0;
    this.clothing = {
      hat: null,
      footwear: null,
      handItem: null,
      hair: null,
      fOutfit: null,
      fSkirt: null,
      mTop: null,
      mBottom: null,
    };

    loadGameConfig().then((config) => {
      if (!config) {
        console.error("Config hasn't been set");
        return;
      }
      this.selectedCharacter = config.selectedCharacter;
    });
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
    this.load.spritesheet(
      "sandstoneFemaleCharacter",
      sandstoneFemaleCharacter,
      {
        frameWidth: 80,
        frameHeight: 64,
      }
    );
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

    // load all items
    this.assets.forEach((assetMap) => {
      Object.keys(assetMap).forEach((assetName) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sprite = (assetMap as any)[assetName].sprite;
        this.load.spritesheet(assetName, sprite, {
          frameWidth: 80,
          frameHeight: 64,
        });
      });
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
    ].concat(
      this.assets
        .map((asset) => Object.keys(asset))
        .reduce((a, b) => a.concat(b))
    );

    characters.forEach((character) => {
      const makeAnim = (
        key: string,
        start: number,
        end: number,
        frameRate: number,
        repeat: number
      ) => {
        if (!this.anims.exists(key)) {
          this.anims.create({
            key,
            frames: this.anims.generateFrameNumbers(character, { start, end }),
            frameRate,
            repeat,
          });
        }
      };

      makeAnim(`${character}-idle`, 0, 4, 6, -1);
      makeAnim(`${character}-jump-rise`, 30, 33, 8, -1);
      makeAnim(`${character}-jump-fall`, 40, 43, 8, -1);
      makeAnim(`${character}-walk`, 10, 17, 10, -1);
      makeAnim(`${character}-run`, 20, 27, 14, -1);
      makeAnim(`${character}-strike`, 50, 55, 12, 0);
      makeAnim(`${character}-die`, 60, 69, 10, 0);
    });

    // Bird animation
    // ✅ Small helper to prevent duplicates
    const makeAnim = (
      key: string,
      spriteKey: string,
      start: number | null,
      end: number | null,
      frameRate: number,
      repeat: number
    ) => {
      if (!this.anims.exists(key)) {
        this.anims.create({
          key,
          frames:
            start !== null && end !== null
              ? this.anims.generateFrameNumbers(spriteKey, { start, end })
              : [{ key: spriteKey, frame: start! }], // for single-frame animations
          frameRate,
          repeat,
        });
      }
    };

    // 🐦 Bird
    makeAnim("bird-fly", "bird", 0, 7, 10, -1);

    // 🐌 Snail
    makeAnim("snail-run", "snail", 0, 7, 6, -1);
    makeAnim("snail-hide", "snail", 8, 15, 8, 0);
    makeAnim("snail-comeout", "snail", 16, 23, 8, 0);
    makeAnim("snail-die", "snail", 24, 31, 10, 0);
    makeAnim("snail-idle", "snail", 32, null, 1, -1); // single frame

    // 🐝 Bee
    makeAnim("bee-fly", "bee", 0, 3, 10, -1);
    makeAnim("bee-die", "bee", 4, 7, 10, 0);
    makeAnim("bee-attack", "bee", 8, 11, 10, -1);

    // 🐗 Boars
    ["brownBoar", "blackBoar", "whiteBoar"].forEach((boarKey) => {
      makeAnim(`${boarKey}-run`, boarKey, 0, 5, 8, -1);
      makeAnim(`${boarKey}-die`, boarKey, 6, 9, 8, 0);
      makeAnim(`${boarKey}-idle`, boarKey, 12, 15, 2, -1);
    });

    // ❤️ Health bar
    [7, 6, 5, 4, 3, 2, 1, 0].forEach((healthStatus, index) => {
      const key = `health-${healthStatus}`;
      if (!this.anims.exists(key)) {
        this.anims.create({
          key,
          frames: this.anims.generateFrameNumbers("healthBar", {
            start: 2 + 6 * index,
            end: 2 + 6 * index + 5,
          }),
          frameRate: 2,
          repeat: 0,
        });
      }
    });

    // 🪙 Coin
    makeAnim("coin-idle", "goldCoin", 0, 9, 6, -1);

    this.add
      .sprite(130, 110, "emptyCoin")
      .setScale(0.08)
      .setDepth(4)
      .setOrigin(0.5, 0.5);

    this.coinsDisplayText = this.add
      .text(155, 127, `x ${this.coins}`, {
        fontFamily: "Pixelify Sans",
        fontSize: "2rem",
        color: "#ba9158",
      })
      .setOrigin(0, 1)
      .setDepth(5);

    this.character = this.add
      .sprite(0, 0, this.selectedCharacter)
      .setOrigin(0.5, 1)
      .setFlipX(true);

    this.character.play(`${this.selectedCharacter}-idle`);

    this.platform = this.add
      .rectangle(width / 2, this.groundHeight, width * 3, 16, 0x000000, 0)
      .setOrigin(0.5, 0);
    this.physics.add.existing(this.platform, true);
    this.playerContainer = this.add
      .container(100, this.groundHeight, [this.character])
      .setDepth(3);
    this.physics.add.existing(this.playerContainer);
    const body = this.playerContainer.body as Phaser.Physics.Arcade.Body;
    body.setCollideWorldBounds(true);
    body.setSize(16, 43); // hitbox size — tune this to fit your sprite
    this.playerContainer.setScale(2.5);
    body.setOffset(-8, -43);

    this.physics.add.collider(this.playerContainer, this.platform);

    loadGameConfig().then((config) => {
      if (!config) {
        console.error("Config hasn't been set");
        return;
      }
      this.loadGameConfig(config);
    });

    this.input.keyboard?.on("keydown-SPACE", () => {
      if (this.playerContainer && this.gameStarted && !this.playerDied) {
        const body = this.playerContainer.body as Phaser.Physics.Arcade.Body;
        if (body.blocked.down) {
          body.setVelocityY(-500);
        }
      }
    });

    const reactCtx = (window as { REACT_CONTEXT?: AppContextType })
      .REACT_CONTEXT;

    if (reactCtx?.isGameStarted && !this.gameStarted) {
      this.character.play(`${this.selectedCharacter}-walk`);
      this.gameStarted = true;
    }

    const pauseGameEventHandler: EventListenerOrEventListenerObject = (
      event
    ) => {
      if ((event as CustomEvent).detail.isPaused) {
        this.scene.pause();
      } else {
        this.scene.resume();
      }
    };

    const restartGameEventHandler = () => {
      this.scene.restart();
    };

    const endGameEventHandler = () => {
      this.scene.restart();
    };

    const handleNewChangesEvent = (e: Event) => {
      const event = e as CustomEvent<GameConfigType>;
      const config = event.detail
      this.selectedCharacter = config.selectedCharacter;
      this.character!.play(`${this.selectedCharacter}-idle`);
      if (config.characterGender === "male") {
        const mConfig: mClothingType = {
          bottom: config.clothing.bottom || null,
          footwear: config.clothing.footwear,
          hair: config.hair,
          handItem: config.hand,
          hat: config.clothing.hat,
          top: config.clothing.top || null,
        };
        this.putOnClothing(mConfig);
      } else if (config.characterGender === "female") {
        const fClothing: fClothingType = {
          footwear: config.clothing.footwear,
          hair: config.hair,
          handItem: config.hand,
          hat: config.clothing.hat,
          outfit: config.clothing.outfit || null,
          skirt: config.clothing.skirt || null,
        };
  
        this.putOnClothing(fClothing);
      }
    };

    window.addEventListener("pauseGame", pauseGameEventHandler);

    window.addEventListener("restartGame", restartGameEventHandler);

    window.addEventListener("endGame", endGameEventHandler);

    window.addEventListener("newChanges", handleNewChangesEvent);

    this.events.once("shutdown", () => {
      window.removeEventListener("pauseGame", pauseGameEventHandler);
      window.removeEventListener("restartGame", restartGameEventHandler);
      window.removeEventListener("endGame", endGameEventHandler);
      window.removeEventListener("newChanges", handleNewChangesEvent);
    });

    this.events.once("destroy", () => {
      window.removeEventListener("pauseGame", pauseGameEventHandler);
      window.removeEventListener("restartGame", restartGameEventHandler);
      window.removeEventListener("endGame", endGameEventHandler);
    });

    this.physics.world.createDebugGraphic(); // Uncomment this for debugging
  }

  update(_: number, delta: number) {
    if ((window as { REACT_CONTEXT?: AppContextType }).REACT_CONTEXT)
      this.gameStarted = (
        window as { REACT_CONTEXT?: AppContextType }
      ).REACT_CONTEXT!.isGameStarted;
    if (!this.playerContainer || !this.character) return;

    const body = this.playerContainer.body as Phaser.Physics.Arcade.Body;

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
      this.followThroughAnimation("-jump-rise");
    } else if (
      body.velocity.y > 10 &&
      !body.blocked.down &&
      this.gameStarted &&
      !this.playerDied
    ) {
      this.character.play(`${this.selectedCharacter}-jump-fall`);
      this.followThroughAnimation("-jump-fall");
    } else if (body.blocked.down && this.gameStarted && !this.playerDied) {
      // Only play walk or run when grounded and not already playing
      if (
        this.scrollSpeed > 250 &&
        this.character.anims.getName() !== `${this.selectedCharacter}-run`
      ) {
        this.character.play(`${this.selectedCharacter}-run`);
        this.followThroughAnimation("-run");
      } else if (
        this.scrollSpeed <= 250 &&
        this.character.anims.getName() !== `${this.selectedCharacter}-walk`
      ) {
        this.character.play(`${this.selectedCharacter}-walk`);
        this.followThroughAnimation("-walk");
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

      if (!this.playerDied) {
        this.coinSpawnTimer += delta;
        if (
          this.coinSpawnTimer >= this.getSpawnCollectibleInterval() &&
          this.shouldSpawnCollectible()
        ) {
          this.coinSpawnTimer = 0;
          this.spawnColletible("coin");
        }
      }

      // update coin balance

      if (this.coinsDisplayText)
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
    if (!this.platform || !this.playerContainer) return;
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
    mob.setDepth(4).setAlpha(1).setVisible(true);
    this.mobs.push(mob);
    this.physics.add.overlap(this.playerContainer, mob, () => {
      this.handleMobCollision(mob);
    });
  }

  handleMobCollision(mob: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) {
    // const type = mob.getData("type");
    if (!this.playerContainer || this.playerDied || !this.character) return;

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
    this.flashCharacterAndClothing()
  }

  killPlayer(killerMob: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) {
    if (!this.character) return;
    this.character.play(`${this.selectedCharacter}-die`);
    this.followThroughAnimation("-die");
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
    setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent("gameOver", {
          detail: { coinsCollected: this.coins, score: this.distance },
        })
      );
    }, 3_000);
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
    if (!this.playerContainer) throw new Error("Character not found!");
    const x = (this.sys.game.config.width as number) + 0;
    const y = this.groundHeight - (Phaser.Math.Between(0, 1) ? 50 : 140);
    let collectible: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | null =
      null;

    if (type === "coin") {
      collectible = this.physics.add
        .sprite(x, y, "coin")
        .setSize(563, 564)
        .setScale(0.05)
        .setOffset(64, 44);
      collectible.play("coin-idle");
    } /*  else if(type === "heart"){

    }  */ else {
      throw new Error("Collectible " + type + " not found!");
    }
    collectible.setDepth(3);
    collectible.body.setAllowGravity(false);
    this.bgElements.push(collectible);
    this.physics.add.overlap(this.playerContainer, collectible, () =>
      this.handleCollectibleCollision(collectible)
    );
  }

  handleCollectibleCollision(
    collectible: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
  ) {
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
    const decayRate = 0.006; // Lower = slower decay
    const randomness = Phaser.Math.Between(-400, 400); // Add jitter

    const interval = baseInterval * Math.exp(-decayRate * this.distance);
    const noisyInterval = Math.max(minInterval, interval + randomness);

    return noisyInterval;
  }

  shouldSpawnCollectible(): boolean {
    const baseChance = 0.04;
    const chance = baseChance + this.distance / 100000; // increase over time
    return Math.random() < Math.min(chance, 0.3); // max 30% chance
  }

  loadGameConfig(config: GameConfigType) {
    this.selectedCharacter = config.selectedCharacter;
    if (config.characterGender === "male") {
      const mConfig: mClothingType = {
        bottom: config.clothing.bottom || null,
        footwear: config.clothing.footwear,
        hair: config.hair,
        handItem: config.hand,
        hat: config.clothing.hat,
        top: config.clothing.top || null,
      };
      this.putOnClothing(mConfig);
    } else if (config.characterGender === "female") {
      const fClothing: fClothingType = {
        footwear: config.clothing.footwear,
        hair: config.hair,
        handItem: config.hand,
        hat: config.clothing.hat,
        outfit: config.clothing.outfit || null,
        skirt: config.clothing.skirt || null,
      };

      this.putOnClothing(fClothing);
    }
  }

  resetAllAnimations() {
    if (!this.character) return;
    if (!this.playerContainer || !this.clothing) {
      console.error("Player not initialized");
      return;
    }
    this.character.play(this.character.anims.getName());
    Object.keys(this.clothing).forEach((key) => {
      if (this.clothing![key as keyof typeof this.clothing]) {
        const clothingItem = this.clothing![key as keyof typeof this.clothing];
        if (clothingItem) {
          clothingItem.play(`${clothingItem.texture.key}-idle`);
        }
      }
    });
  }

  putOnClothing(clothing: mClothingType | fClothingType) {
    if (!this.playerContainer) {
      console.error("Player not initialized");
      return;
    }
    this.resetAllAnimations();

    console.log("reset all animations");
    console.log("Clothing keys", Object.keys(clothing));

    // Character anchor point (feet)
    const charX = 0;
    const charY = 0;

    Object.keys(clothing).forEach((key) => {
      if (!this.playerContainer || !this.clothing) {
        console.error("Player not initialized");
        return;
      }

      const assetName = clothing[key as keyof typeof clothing];
      if (!assetName) return; // nothing equipped in this slot

      // Helper to avoid repetition
      const addClothingSprite = (
        slot: keyof typeof this.clothing,
        depth: number
      ) => {
        if (!this.playerContainer || !this.clothing) {
          console.error("Player not initialized");
          return;
        }


        // Destroy old sprite if exists
        if (this.clothing[slot]) {
          this.clothing[slot].destroy();
        }
        // Create new sprite
        this.clothing[slot] = this.add
          .sprite(charX, charY, assetName)
          .setOrigin(0.5, 1)
          .setFlipX(true)
          .setDepth(depth)
          .play(`${assetName}-idle`);
        // Add to container
        this.playerContainer!.add(this.clothing[slot]);
        console.log("equipped", key, "->", assetName);
      };

      // Equip based on clothing slot
      switch (key) {
        case "hat":
          addClothingSprite("hat", 2);
          break;
        case "footwear":
          addClothingSprite("footwear", 1);
          break;
        case "handItem":
          addClothingSprite("handItem", 3); // usually above body
          break;
        case "hair":
          addClothingSprite("hair", 2); // above head, behind hat
          break;
        case "outfit":
          addClothingSprite("fOutfit", 1);
          break;
        case "skirt":
          addClothingSprite("fSkirt", 2);
          break;
        case "top":
          addClothingSprite("mTop", 1);
          break;
        case "bottom":
          addClothingSprite("mBottom", 1);
          break;
      }
    });
  }

  followThroughAnimation(sequence: string) {
    if (!this.playerContainer || !this.clothing) {
      console.error("Player not initialized");
      return;
    }
    Object.keys(this.clothing).forEach((key) => {
      const item = this.clothing![key as keyof typeof this.clothing];
      if (item) {
        item.play(item.texture.key + sequence, true);
      }
    });
  }

  flashCharacterAndClothing() {
    // Collect all sprites (main character + clothing layers)
    if(!this.character){
      console.error("Character not initialized");
      return
    }
    const sprites: Phaser.GameObjects.Sprite[] = [
      this.character,
      ...(Object.values(this.clothing || {}).filter(
        (item): item is Phaser.GameObjects.Sprite => !!item
      )),
    ];
  
    // Apply tint + flash tween to all
    sprites.forEach((sprite) => {
      sprite.setTint(0xff0000);
  
      this.tweens.add({
        targets: sprite,
        alpha: 0.2,
        ease: "Linear",
        duration: 100,
        yoyo: true,
        repeat: 3,
        onComplete: () => {
          sprite.clearTint();
          sprite.setAlpha(1);
        },
      });
    });
  }
  
}

export default GameScene;
