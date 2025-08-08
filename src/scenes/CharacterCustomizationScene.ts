import Phaser from "phaser";

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

// dogs
import luna from "../assets/pet_companion/luna.png";
import maple from "../assets/pet_companion/maple.png";
import milo from "../assets/pet_companion/milo.png";
import nova from "../assets/pet_companion/nova.png";
import rusty from "../assets/pet_companion/rusty.png";

// foxs
import ember from "../assets/pet_companion/ember_the_fox.png";

// pet accessories
import dogBackpack from "../assets/pet_companion/dog_backpack.png";
import dogHat from "../assets/pet_companion/dog_hat.png";

import { DEFAULT_CHARACTER } from "../constants"



export class PetCustomizationScene extends Phaser.Scene{
  constructor(){
    super("PetCustomizationScene");
  }

  preload(){
    [
      ["luna", luna],
      ["maple", maple],
      ["milo", milo],
      ["nova", nova],
      ["rusty", rusty],
      ["ember", ember],
      ["dogBackPack", dogBackpack],
      ["dogHat", dogHat],
    ].forEach((pet) => {
      this.load.spritesheet(pet[0], pet[1], {
        frameWidth: 32,
        frameHeight: 32,
      });
    });
  }

  create(){
    console.log("Adding pet image")
    
    const pet = this.add.sprite(32, -16, "luna", 0);
    this.anims.create({
      key: "luna-idle",
      frames: this.anims.generateFrameNumbers("luna", {
        start: 0,
        end: 3,
      }),
      frameRate: 6,
      repeat: -1,
    });
    pet.play("luna-idle");
    pet.setScale(1.3);
    pet.setOrigin(0.5, 0);
  }
}

export class CharacterCustomizationScene extends Phaser.Scene{
  character: Phaser.GameObjects.Sprite | null= null
  characters: [string, string][] = [
    ["ivoryMaleCharacter", ivoryMaleCharacter],
    ["onyxMaleCharacter", onyxMaleCharacter],
    ["bronzeMaleCharacter", bronzeMaleCharacter],
    ["sandstoneMaleCharacter", sandstoneMaleCharacter],
    ["umberMaleCharacter", umberMaleCharacter],
    ["ivoryFemaleCharacter", ivoryFemaleCharacter],
    ["onyxFemaleCharacter", onyxFemaleCharacter],
    ["bronzeFemaleCharacter", bronzeFemaleCharacter],
    ["sandstoneFemaleCharacter", sandstoneFemaleCharacter],
    ["umberFemaleCharacter", umberFemaleCharacter],
  ];
  selectedCharacter: string = DEFAULT_CHARACTER
  constructor(){
    super("CharacterCustomizationScene");
  }

  preload(): void {
    this.characters.forEach((character) => {
      this.load.spritesheet(character[0], character[1], {
        frameWidth: 80,
        frameHeight: 64,
      });

    });
  }

  create(){

    console.log("Adding image")
  
    this.character = this.add.sprite(32, -16, DEFAULT_CHARACTER, 0);
    this.characters.forEach((character) => {
      this.anims.create({
        key: `${character[0]}-idle`,
        frames: this.anims.generateFrameNumbers(character[0], {
          start: 0,
          end: 3,
        }),
        frameRate: 6,
        repeat: -1,
      });
    })

    this.character.play(`${this.selectedCharacter}-idle`);
    this.character.setScale(1.3).setFlipX(true)
    
    
    
    this.character.setOrigin(0.5, 0);
  }


}


