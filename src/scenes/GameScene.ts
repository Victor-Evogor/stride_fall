import Phaser from "phaser";
import type { AppContextType } from "../AppContext";

import damageBar from "../assets/UI/MinimumDamage/minimum_damage.png"

// characters
import onyxMaleCharacter from "../assets/character_assets/male/skin/onyx.png";

import skyBg from "../assets/background/sky.png";
import texturesSprite from "../assets/Textures-16.png";

// shrubs and trees
import shrubs from "../assets/Trees/shrubs.png";
import greenTree from "../assets/Trees/two_green_tall_trees.png";

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

class GameScene extends Phaser.Scene {
  character: Phaser.Physics.Arcade.Sprite | null = null;
  scrollSpeed: number = 100;
  bgElements: Phaser.GameObjects.Image[] = [];
  gameStarted: boolean = false;
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
  healthBar: Phaser.GameObjects.Sprite | null =  null;
  

  constructor() {
    super("GameScene");
  }

  preload() {
    this.load.image("sky", skyBg);
    this.load.spritesheet("shrubs", shrubs, {
      frameWidth: 112,
      frameHeight: 256,
    });
    this.load.spritesheet("greenTree", greenTree, {
      frameWidth: 112,
      frameHeight: 366, // two trees
    });
    this.load.spritesheet("tiles", texturesSprite, {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet("onyxMaleCharacter", onyxMaleCharacter, {
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
      frameHeight: 16
    })
  }

  create() {
    const width = this.sys.game.config.width as number;
    const height = this.sys.game.config.height as number;

    const bg = this.add.image(0, 0, "sky").setOrigin(0);
    bg.setDisplaySize(width, height);

    const TILE_SCALE = 4;
    const TILE_PIXEL = 16;
    const tileSize = TILE_PIXEL * TILE_SCALE;
    this.groundHeight = height - tileSize * 4;
    const COLUMNS_PER_ROW = 32;
    const undergroundRows = 3;

    this.birds = [];
    this.birdSpawnTimer = 0;
    this.nextBirdSpawnDelay = Phaser.Math.Between(1000, 3000); // spawn delay in ms

    this.healthBar = this.add.sprite(200, 50, "healthBar").setScale(3).setDepth(4)

    const getRandomColumnIndex = () => {
      const r = Math.random();
      if (r < 0.85) return Phaser.Math.Between(0, 5);
      else if (r < 0.9) return 7;
      else if (r < 0.9998) return Phaser.Math.Between(8, 9);
      else return Phaser.Math.Between(10, 13);
    };

    for (let x = 0; x < Math.ceil(width / tileSize) + 1; x++) {
      const colIndex = getRandomColumnIndex();
      const frame = 29 * COLUMNS_PER_ROW + colIndex;

      const tileFrame = this.add
        .image(x * tileSize, this.groundHeight, "tiles", frame)
        .setOrigin(0)
        .setScale(TILE_SCALE);

      this.bgElements.push(tileFrame);

      for (let y = 1; y <= undergroundRows; y++) {
        const undergroundFrameIndex =
          y === undergroundRows
            ? (29 + y - 1) * COLUMNS_PER_ROW + Phaser.Math.Between(0, 1)
            : (29 + y) * COLUMNS_PER_ROW + Phaser.Math.Between(0, 1);

        const undergroundTileFrame = this.add
          .image(
            x * tileSize,
            this.groundHeight + y * tileSize,
            "tiles",
            undergroundFrameIndex
          )
          .setOrigin(0)
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
            .image(treeX, this.groundHeight, "greenTree", treeFrame)
            .setOrigin(0.5, 1)
            .setScale(1.2)
            .setDepth(0)
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
      ); // shrubs on higher depth

      for (let i = 0; i < numMiddle; i++) {
        this.bgElements.push(
          this.add
            .image(shrubStartX + 112 * (i + 1), this.groundHeight, "shrubs", 1)
            .setOrigin(0, 1)
            .setScale(1.2)
            .setDepth(1)
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
      );

      if (treeInFront) {
        // Draw tree last → in front of shrubs
        this.bgElements.push(
          this.add
            .image(treeX, this.groundHeight, "greenTree", treeFrame)
            .setOrigin(0.5, 1)
            .setScale(1.2)
            .setDepth(2)
        );
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

    // Walk (row 1)
    this.anims.create({
      key: "walk",
      frames: this.anims.generateFrameNumbers("onyxMaleCharacter", {
        start: 10,
        end: 17,
      }),
      frameRate: 10,
      repeat: -1,
    });

    // Run (row 2)
    this.anims.create({
      key: "run",
      frames: this.anims.generateFrameNumbers("onyxMaleCharacter", {
        start: 20,
        end: 27,
      }),
      frameRate: 14,
      repeat: -1,
    });

    // Strike (row 5 → index 50 to 55)
    this.anims.create({
      key: "strike",
      frames: this.anims.generateFrameNumbers("onyxMaleCharacter", {
        start: 50,
        end: 55,
      }),
      frameRate: 12,
      repeat: 0, // play once
    });

    // Die (row 6 → index 60 to 69)
    this.anims.create({
      key: "die",
      frames: this.anims.generateFrameNumbers("onyxMaleCharacter", {
        start: 60,
        end: 69,
      }),
      frameRate: 10,
      repeat: 0, // play once
    });

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
      frames: [{ key: "snail", frame: 40 }],
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
        frames: this.anims.generateFrameNumbers(key, { start: 10, end: 13 }),
        frameRate: 2,
        repeat: -1,
      });
    });

    [7,6,5,4,3,2,1,0].forEach(((healthStatus, index) => {
      this.anims.create({
        key: `health-${healthStatus}`,
        frames: this.anims.generateFrameNumbers("healthBar", {start: 2 + 6 * index, end: 2 + 6 * index + 5}),
        frameRate: 2,
        repeat: 0
      })
    }))

    this.character = this.physics.add
      .sprite(100, this.groundHeight, "onyxMaleCharacter")
      .setOrigin(0.5, 1)
      .setScale(2.5)
      .setFlipX(true)
      .setDepth(3)
      .setCollideWorldBounds(true);

    if (this.character && this.character.body) {
      this.character.body.setSize(16, 43);
      this.character.body.setOffset(32, 20);
      this.character.play("idle");
    }

    this.platform = this.add
      .rectangle(width / 2, this.groundHeight, width, 16, 0x000000, 0)
      .setOrigin(0.5, 0);
    this.physics.add.existing(this.platform, true);
    this.physics.add.collider(this.character, this.platform);

    this.input.keyboard?.on("keydown-SPACE", () => {
      if (this.character && this.character.body && this.gameStarted && !this.playerDied) {
        const body = this.character.body as Phaser.Physics.Arcade.Body;
        if (body.blocked.down) {
          this.character.setVelocityY(-500);
        }
      }
    });

    const reactCtx = (window as { REACT_CONTEXT?: AppContextType })
      .REACT_CONTEXT;

    if (reactCtx?.isGamePlaying && !this.gameStarted) {
      this.character.play("walk");
      this.gameStarted = true;
    }

    // this.physics.world.createDebugGraphic();
  }

  update(_: number, delta: number) {
    if ((window as { REACT_CONTEXT?: AppContextType }).REACT_CONTEXT)
      this.gameStarted = (
        window as { REACT_CONTEXT?: AppContextType }
      ).REACT_CONTEXT!.isGamePlaying;
    if (!this.character) return;

    const body = this.character.body as Phaser.Physics.Arcade.Body;

    if (body.velocity.y < -10 && !body.blocked.down && this.gameStarted) {
      // console.log("jumping")
      this.character.play("jump-rise");
    } else if (body.velocity.y > 10 && !body.blocked.down && this.gameStarted) {
      this.character.play("jump-fall", true);
    } else if (body.blocked.down && this.gameStarted && !this.playerDied) {
      // Only play walk or run when grounded and not already playing
      if (this.scrollSpeed > 250 && this.character.anims.getName() !== "run") {
        this.character.play("run");
      } else if (
        this.scrollSpeed <= 250 &&
        this.character.anims.getName() !== "walk"
      ) {
        this.character.play("walk");
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

      if(!this.playerDied)
      this.scrollSpeed = base + (max - base) * (1 - Math.exp(-k * t));
      else
        this.scrollSpeed = 0;

      this.bgElements.forEach((obj) => {
        obj.x -= this.scrollSpeed * (delta / 1000);

        if (obj.x + obj.displayWidth < 0) {
          obj.x += (this.sys.game.config.width as number) + obj.displayWidth;
        }
      });

      // --- MOB MOVEMENT ---
      this.mobs = this.mobs.filter((mob) => {
        mob.x -= this.scrollSpeed * (delta / 1000);
        if (mob.x < -100) {
          mob.destroy();
          return false;
        }
        return true;
      });

      // --- MOB SPAWNING ---
      if (!this.playerDied){
        this.mobSpawnTimer += delta;
      if (this.mobSpawnTimer >= this.getSpawnInterval()) {
        this.mobSpawnTimer = 0;
        const type = this.selectMobTypeBySpeed();
        this.spawnMob(type);
      }
      }
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
    const x = (this.sys.game.config.width as number) + 100;
    const groundY = this.groundHeight;
    let mob: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | null = null;

    if (type === "snail") {
      mob = this.physics.add.sprite(x, groundY, "snail"); // or 'boar-brown'
      mob.setOrigin(2, 1.2);
      mob.play("snail-run");
      this.physics.add.collider(mob, this.platform);
      mob.play("snail-run");
      mob.setScale(2.5)
      mob.setSize(19, 20)
    mob.body.setOffset(19, 12);
    } else if (type === "bee") {
      mob = this.physics.add
        .sprite(x, this.groundHeight - 100, "bee")
        .setOrigin(0.5, 1);
      mob.play("bee-fly");
      mob.body.setAllowGravity(false);
      mob.setScale(1.5)
    } else if (type === "boar") {
      const boarColors = ["brownBoar", "blackBoar", "whiteBoar"];
      const selected = Phaser.Utils.Array.GetRandom(boarColors);
      mob = this.physics.add.sprite(x, groundY, selected).setOrigin(0.5, 1);
      this.physics.add.collider(mob, this.platform);
      mob.setData("boarType", selected);
      mob.play(`${selected}-run`);
      mob.setScale(2.5)
      mob.body.setOffset(0, 2);
    }

    if (!mob) throw new Error("Mob type " + type + " not known");

    mob.setVelocityX(-this.scrollSpeed);
    mob.setData("type", type);
    mob.setDepth(3)
    this.physics.add.overlap(this.character, mob, () =>
      this.handleMobCollision(mob)
    );
  }

  handleMobCollision(mob: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) {
    const type = mob.getData("type");
    if (!this.character || this.playerDied) return;
  
    const body = this.character.body as Phaser.Physics.Arcade.Body;
  
    // Always deduct health and update UI
    const isJumping = !body.blocked.down;
  
    if (type === "bee") {
      if (isJumping) {
        this.health--;
        this.updateHealthBarGui(this.health); // ← Always update UI after health change
  
        if (this.health <= 0) {
          this.killPlayer(mob);
          return;
        }
  
        mob.play("bee-die");
        mob.setVelocityX(0);
        mob.setGravityY(1000); // fall down
        return;
      }
  
      // player is not jumping → bee missed
      return;
    }
  
    // Not a bee (snail or boar)
    this.health--;
    this.updateHealthBarGui(this.health);
  
    if (this.health <= 0) {
      this.killPlayer(mob);
      return;
    }
  
    // Mob death logic (only if player survived)
    if (type === "snail") {
      mob.play("snail-die");
      mob.setVelocityX(0);
      mob.disableBody(true, true);
    } else if (type === "boar") {
      const boarType = mob.getData("boarType");
      mob.play(`${boarType}-die`);
      mob.setVelocityX(0);
      this.time.delayedCall(1000, () => mob.destroy());
    }
  
    // Flash red
    this.character.setTint(0xff0000);
    this.tweens.add({
      targets: this.character,
      alpha: 0.2,
      ease: 'Linear',
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
    this.character.play("die");
    this.scrollSpeed = 0;
    this.playerDied = true;

    const type = killerMob.getData("type");

    if (type === "snail") {
      killerMob.play("snail-hide");
      killerMob.setVelocityX(0);
      this.time.delayedCall(2000, () => {
        killerMob.play("snail-comeout");
        killerMob.setVelocityX(0);
      });
    } else if (type === "boar") {
      const boarType = killerMob.getData("boarType");
      killerMob.play(`${boarType}-idle`);
      killerMob.setVelocityX(0);
    } else if (type === "bee") {
      killerMob.play("bee-fly");
      // let it keep flying offscreen
    }

    // stop all background movement, etc.
  }

  getSpawnInterval(): number {
    if (this.scrollSpeed < 200) return 3000;
    if (this.scrollSpeed < 300) return 2500;
    return 1800;
  }

  selectMobTypeBySpeed(): "snail" | "bee" | "boar" {
    // if (this.scrollSpeed < 200) return "snail";
    // if (this.scrollSpeed < 300) return "bee";
    return "snail";
  }

  updateHealthBarGui(health: number){
    if (!this.healthBar) return
    this.healthBar.play(`health-${health}`);
  }
}

export default GameScene;
