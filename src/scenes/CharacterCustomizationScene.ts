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

import { femaleFootwear, femaleHair, femaleHand, femaleOutfit, femaleSkirt, hats, maleBottomClothing, maleFootwear, maleHair, maleHand, maleTopClothing, petAccessories} from "../assetMap"

import {type fClothingType, type mClothingType} from "../components/CharacterMenu"



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
    
    const pet = this.add.sprite(30, -16, "luna", 0);
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
    pet.setScale(1.8);
    pet.setOrigin(0.5, 0);

    const handleCustomizationAction: EventListenerOrEventListenerObject = (event) => {

    }

    this.events.once("destroy", ()=> {
      window.removeEventListener("customizationAction",handleCustomizationAction)
    })
  }
}

export class CharacterCustomizationScene extends Phaser.Scene{
  character: Phaser.GameObjects.Sprite | null = null
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
  assets = [femaleFootwear, femaleHair, femaleHand, femaleOutfit, femaleSkirt, hats, maleBottomClothing, maleFootwear, maleHair, maleHand, maleTopClothing]
  clothing: {
    hat: Phaser.GameObjects.Sprite | null,
    footwear: Phaser.GameObjects.Sprite | null,
    handItem: Phaser.GameObjects.Sprite | null,
    hair: Phaser.GameObjects.Sprite | null,
    fOutfit: Phaser.GameObjects.Sprite | null,
    fSkirt: Phaser.GameObjects.Sprite | null,
    mTop: Phaser.GameObjects.Sprite | null,
    mBottom: Phaser.GameObjects.Sprite | null,
  } = {
    "hat": null,
    "footwear": null,
    "handItem": null,
    "hair": null,
    "fOutfit": null,
    "fSkirt": null,
    "mTop": null,
    "mBottom": null,
  }

  
  constructor(){
    super("CharacterCustomizationScene");
  }

  resetAllAnimations() {
    if(!this.character) return
    this.character.play(this.character.anims.getName())
    Object.keys(this.clothing).forEach((key) => {
      if(this.clothing[key as keyof typeof this.clothing]) {
        const clothingItem = this.clothing[key as keyof typeof this.clothing];
        if(clothingItem) {
          clothingItem.play(`${clothingItem.texture.key}-idle`);
        }
      }
    })
  }

  clearClothing(){
    Object.keys(this.clothing).forEach((key) => {
      if(this.clothing[key as keyof typeof this.clothing]){
        const clothingItem = this.clothing[key as keyof typeof this.clothing];
        if(clothingItem){
          clothingItem.destroy();
          this.clothing[key as keyof typeof this.clothing] = null;
        }
      }
    })
    this.clothing = {
      "hat": null,
      "footwear": null,
      "handItem": null,
      "hair": null,
      "fOutfit": null,
      "fSkirt": null,
      "mTop": null,
      "mBottom": null,
    }
  }

  putOnClothing(clothing: mClothingType | fClothingType){
    this.resetAllAnimations()
    console.log("reset all animations")
    console.log("Clothing keys", Object.keys(clothing))
    Object.keys(clothing).forEach((key) => {
      if(key === "hat" && clothing[key as keyof typeof clothing]){
        this.clothing.hat = this.add.sprite(32, -25, clothing[key as keyof typeof clothing]!, 0).setScale(2.3).setFlipX(true).setOrigin(0.5, 0).setDepth(5).play(`${clothing[key as keyof typeof clothing]}-idle`);
        console.log("key", key, "assetName", clothing[key as keyof typeof clothing]!)
      } else if(key === "footwear" && clothing[key as keyof typeof clothing]){
        this.clothing.footwear = this.add.sprite(32, -25, clothing[key as keyof typeof clothing]!, 0).setScale(2.3).setFlipX(true).setOrigin(0.5, 0).play(`${clothing[key as keyof typeof clothing]}-idle`);
        console.log("key", key, "assetName", clothing[key as keyof typeof clothing]!)

      }
      else if(key === "handItem" && clothing[key as keyof typeof clothing]){
        this.clothing.handItem = this.add.sprite(32, -25, clothing[key as keyof typeof clothing]!, 0).setScale(2.3).setFlipX(true).setOrigin(0.5, 0).setDepth(5).play(`${clothing[key as keyof typeof clothing]}-idle`);
        console.log("key", key, "assetName", clothing[key as keyof typeof clothing]!)

      } else if(key === "hair" && clothing[key as keyof typeof clothing]){
        this.clothing.hair = this.add.sprite(32, -25, clothing[key as keyof typeof clothing]!, 0).setScale(2.3).setFlipX(true).setOrigin(0.5, 0).play(`${clothing[key as keyof typeof clothing]}-idle`);
        console.log("key", key, "assetName", clothing[key as keyof typeof clothing]!)

      } else if(key === "outfit" && clothing[key as keyof typeof clothing]){
        this.clothing.fOutfit = this.add.sprite(32, -25, clothing[key as keyof typeof clothing]!, 0).setScale(2.3).setFlipX(true).setOrigin(0.5, 0).play(`${clothing[key as keyof typeof clothing]}-idle`);
        console.log("key", key, "assetName", clothing[key as keyof typeof clothing]!)

      } else if(key === "skirt" && clothing[key as keyof typeof clothing]){
        this.clothing.fSkirt = this.add.sprite(32, -25, clothing[key as keyof typeof clothing]!, 0).setScale(2.3).setFlipX(true).setOrigin(0.5, 0).setDepth(1).play(`${clothing[key as keyof typeof clothing]}-idle`);
        console.log("key", key, "assetName", clothing[key as keyof typeof clothing]!)

      } else if(key === "top" && clothing[key as keyof typeof clothing]){
        this.clothing.mTop = this.add.sprite(32, -25, clothing[key as keyof typeof clothing]!, 0).setScale(2.3).setFlipX(true).setOrigin(0.5, 0).play(`${clothing[key as keyof typeof clothing]}-idle`);
        console.log("key", key, "assetName", clothing[key as keyof typeof clothing]!)

      } else if(key === "bottom" && clothing[key as keyof typeof clothing]){
        this.clothing.mBottom = this.add.sprite(32, -25, clothing[key as keyof typeof clothing]!, 0).setScale(2.3).setFlipX(true).setOrigin(0.5, 0).play(`${clothing[key as keyof typeof clothing]}-idle`);
        console.log("key", key, "assetName", clothing[key as keyof typeof clothing]!)

      }
    })

  }

  preload(): void {
    this.characters.forEach((character) => {
      this.load.spritesheet(character[0], character[1], {
        frameWidth: 80,
        frameHeight: 64,
      });
    });

    this.assets.forEach((assetMap) => {
      Object.keys(assetMap).forEach(assetName => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sprite = (assetMap as any)[assetName].sprite
        this.load.spritesheet(assetName, sprite, {
          frameWidth: 80,
          frameHeight: 64,
        });
      })
    })

    
  }

  create(){

  
    this.character = this.add.sprite(32, -25, DEFAULT_CHARACTER, 0);
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

    this.assets.forEach((assetMap) => {
      Object.keys(assetMap).forEach(assetName => {
        if(this.anims.exists(`${assetName}-idle`)) return; // Prevent duplicate animations
        this.anims.create({
          key: `${assetName}-idle`,
          frames: this.anims.generateFrameNumbers(assetName, {
            start: 0,
            end: 3,
          }),
          frameRate: 6,
          repeat: -1,
        })
      })
    })

    this.character.play(`${this.selectedCharacter}-idle`);
    this.character.setScale(2.3).setFlipX(true)
    
    
    
    this.character.setOrigin(0.5, 0);


    const handleCustomizationAction: EventListenerOrEventListenerObject = (event) => {
      if(!this.character){
        console.error("Error: Character not initialized")
        return
      }
      const action = (event as CustomEvent).detail.action
      const payload = (event as CustomEvent).detail.payload
      switch (action) {
        case "genderChange":
          { 
            const newGender = payload.gender;
            const mClothing = payload.mClothing
            const fClothing = payload.fClothing
            const characterColor = payload.color
            if(newGender === "male"){
              this.character.play(`${characterColor}MaleCharacter-idle`)
              this.clearClothing()
              this.putOnClothing(mClothing)
            } else if(newGender == "female"){
              this.character.play(`${characterColor}FemaleCharacter-idle`)
              this.clearClothing()
              this.putOnClothing(fClothing)
            }
          break; 
        }
      
        case "changeCharacterColor":
          {
            const newColor = payload.currentCharacterColor;
            const newCharacter = newColor + (this.character.anims.getName().includes("Male") ? "MaleCharacter-idle" : "FemaleCharacter-idle");
            this.character.play(newCharacter)
            this.resetAllAnimations()
            break;
          }
        
        case "updateCustomizationItem":
          {
            const item = payload.currentItem;
            const assetName= payload.assetName
            const title = payload.title
              if (title === "hats"){
                if (this.clothing.hat){
                  this.clothing.hat.destroy();
                  this.clothing.hat = null;
                }
                // check if this.hat is already set
                if(item){
                this.clothing.hat = this.add.sprite(32, -25, assetName, 0).setScale(2.3).setFlipX(true).setOrigin(0.5, 0).setDepth(5).play(`${assetName}-idle`);
                this.resetAllAnimations()
                }
              } else if(title === "footwear"){
                if (this.clothing.footwear){
                  this.clothing.footwear.destroy();
                  this.clothing.footwear = null;
                }
                if(item)
                {
                  this.clothing.footwear = this.add.sprite(32, -25, assetName, 0).setScale(2.3).setFlipX(true).setOrigin(0.5, 0).play(`${assetName}-idle`);
                  this.resetAllAnimations()
                }
              } else if(title === "outfit"){
                if (this.clothing.fOutfit){
                  this.clothing.fOutfit.destroy();
                  this.clothing.fOutfit = null;
                }
                if(item)
                {
                  this.clothing.fOutfit = this.add.sprite(32, -25, assetName, 0).setScale(2.3).setFlipX(true).setOrigin(0.5, 0).play(`${assetName}-idle`);
                  this.resetAllAnimations()
                }
              } else if(title === "skirt"){
                if (this.clothing.fSkirt){
                  this.clothing.fSkirt.destroy();
                  this.clothing.fSkirt = null;
                }
                if(item)
                {
                  this.clothing.fSkirt = this.add.sprite(32, -25, assetName, 0).setScale(2.3).setFlipX(true).setOrigin(0.5, 0).setDepth(1).play(`${assetName}-idle`);
                  this.resetAllAnimations()
                }
              }
              else if(title === "hair"){
                if (this.clothing.hair){
                  this.clothing.hair.destroy();
                  this.clothing.hair = null
                }
                if(item)
                {
                  this.clothing.hair = this.add.sprite(32, -25, assetName, 0).setScale(2.3).setFlipX(true).setOrigin(0.5, 0).play(`${assetName}-idle`);
                  this.resetAllAnimations()
                }
              }
              else if(title === "hand item"){
                if (this.clothing.handItem){
                  this.clothing.handItem.destroy();
                  this.clothing.handItem =  null;
                }
                if(item){
                this.clothing.handItem = this.add.sprite(32, -25, assetName, 0).setScale(2.3).setFlipX(true).setOrigin(0.5, 0).setDepth(5).play(`${assetName}-idle`);
                this.resetAllAnimations()
                }
              } else if(title === "top"){
                if(this.clothing.mTop){
                  this.clothing.mTop.destroy();
                  this.clothing.mTop = null;
                }
                if(item)
                {
                  this.clothing.mTop = this.add.sprite(32, -25, assetName, 0).setScale(2.3).setFlipX(true).setOrigin(0.5, 0).play(`${assetName}-idle`);
                  this.resetAllAnimations()
                }
              } else if(title === "bottom"){
                if(this.clothing.mBottom){
                  this.clothing.mBottom.destroy();
                  this.clothing.mBottom = null;
                }
                if(item)
                {
                  this.clothing.mBottom = this.add.sprite(32, -25, assetName, 0).setScale(2.3).setFlipX(true).setOrigin(0.5, 0).play(`${assetName}-idle`);
                  this.resetAllAnimations()
                }
              }
            
            break;
          }
        default:
          break;
      }
    }

    window.addEventListener("customizationAction",handleCustomizationAction)

    this.events.once("destroy", ()=> {
      window.removeEventListener("customizationAction",handleCustomizationAction)
    })
  }




}


