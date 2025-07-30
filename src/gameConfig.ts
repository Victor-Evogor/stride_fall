import { z } from 'zod';
import { encryptObject, decryptObject } from './cryptoUtils';

export type MaleCharacters =
  | "ivoryMaleCharacter"
  | "onyxMaleCharacter"
  | "bronzeMaleCharacter"
  | "sandstoneMaleCharacter"
  | "umberMaleCharacter";

export type FemaleCharacters =
  | "ivoryFemaleCharacter"
  | "onyxFemaleCharacter"
  | "bronzeFemaleCharacter"
  | "sandstoneFemaleCharacter"
  | "umberFemaleCharacter";

type MaleTopClothings =
  | "blue_shirt_2"
  | "green_shirt_2"
  | "orange_shirt_2"
  | "purple_shirt_2"
  | "shirt_2"
  | "shirt"
  | null;

type MaleBottomClothings =
  | "blue_pants"
  | "green_pants"
  | "green_underwear"
  | "orange_pants"
  | "orange_underwear"
  | "red_pants"
  | "purple_pants"
  | "purple_underwear"
  | "skyblue_underwear"
  | "light_blue_underwear"
  | null;

type MaleShoes = "boots" | "shoes" | null;

type MaleHats =
  | "farming_hat"
  | "guard_helmet"
  | "blue_cap"
  | "green_cap"
  | "blue_mage_hat"
  | "blue_mushroom_hat"
  | "green_mushroom_hat"
  | "green_cap"
  | "green_mage_hat"
  | "guard_helmet"
  | "orange_cap"
  | "orange_mushroom_hat"
  | "pumpkin_hat"
  | "purple_cap"
  | "purple_mage_hat"
  | "purple_mushroom_hat"
  | "red_cap"
  | "red_mage_hat"
  | "red_mushrooom_hat"
  | "santa_hat"
  | "viking_helmet"
  | "viking_helmet_with_horns"
  | null;

type MaleHandItems =
  | "bronze_axe"
  | "bronze_pickaxe"
  | "bronze_sword"
  | "diamond_axe"
  | "diamond_pickaxe"
  | "diamond_sword"
  | "gold_axe"
  | "gold_pickaxe"
  | "gold_sword"
  | "iron_axe"
  | "iron_pickaxe"
  | "iron_sword"
  | "wooden_axe"
  | "wooden_pickaxe"
  | "wooden_sword"
  | "stick"
  | "farming_hoe"
  | "sword"
  | null;

type MaleHairs = "black" | "blond" | "brown" | "golden" | "red" | null;

type FemaleTopAndBottomClothing =
  | "blue_panties_and_bra"
  | "green_panties_and_bra"
  | "orange_panties_and_bra"
  | "purple_panties_and_bra"
  | "red_panties_and_bra"
  | "skyblue_panties_and_bra"
  | "blue_corset"
  | "blue_corset2"
  | "red_corset2"
  | "red_corset" // this is red
  | "green_corset2"
  | "green_corset"
  | "orange_corset"
  | "orange_corset2"
  | "purple_corset"
  | "purple_corset2"
  | null;

type FemaleFootwear =
  | "boots"
  | "green_socks"
  | "orange_socks"
  | "purple_socks"
  | "red_socks"
  | "skyblue_socks"
  | "silverblue_socks"
  | null;

type FemaleBottomClothings = "skirt" | null;

type FemaleHair = "black" | "blond" | "brown" | "golden" | "red" | null;

type FemaleHandItems =
  | "basket"
  | "bronze_axe"
  | "bronze_pickaxe"
  | "bronze_sword"
  | "diamond_axe"
  | "diamond_pickaxe"
  | "diamond_sword"
  | "flower.png"
  | "golden_axe"
  | "golden_pickaxe"
  | "golden_sword"
  | "hoe"
  | "iron_axe"
  | "iron_pickaxe"
  | "iron_sword"
  | "stick"
  | "sword"
  | "wooden_axe"
  | "wooden_pickaxe"
  | "wooden_sword"
  | null;



type Pets = 
  | "luna"
  | "milo"
  | "nova"
  | "rusty"
  | "maple"
  | null

type PetAccessory = 
  | "dog_backpack"
  | "dog_hat"
  | null

interface GeneralConfig {
  coins: number;
  highScore: number;
  armor: number;
  ownedItems: (
    | MaleTopClothings
    | MaleBottomClothings
    | MaleShoes
    | MaleHandItems
    | MaleHairs
    | FemaleBottomClothings
    | FemaleHair
    | PetAccessory
    | Pets
  )[];
  pet: Pets | null;
  petAccessory: PetAccessory | null;
}

export type GameConfigType =
  | ({
      characterGender: "male";
      selectedCharacter: MaleCharacters;
      clothing: {
        hat: MaleHats;
        top: MaleTopClothings;
        bottom: MaleBottomClothings;
        shoes: MaleShoes;
      };
      hand: MaleHandItems;
      hair: MaleHairs;
    } & GeneralConfig)
  | ({
      characterGender: "female";
      selectedCharacter: FemaleCharacters;
      clothing: {
        hat: MaleHats;
        topBottom: FemaleTopAndBottomClothing;
        shoes: FemaleFootwear
      };
      hand: FemaleHandItems;
      hair: FemaleHair;
    } & GeneralConfig);


    export const GameConfigSchema = z.discriminatedUnion('characterGender', [
      z.object({
        characterGender: z.literal("male"),
        selectedCharacter: z.enum([
          "ivoryMaleCharacter",
          "onyxMaleCharacter",
          "bronzeMaleCharacter",
          "sandstoneMaleCharacter",
          "umberMaleCharacter",
        ]),
        clothing: z.object({
          hat: z.string().nullable(),
          top: z.string().nullable(),
          bottom: z.string().nullable(),
          shoes: z.string().nullable(),
        }),
        hand: z.string().nullable(),
        hair: z.string().nullable(),
        coins: z.number(),
        highScore: z.number(),
        armor: z.number(),
        ownedItems: z.array(z.string().nullable()),
        pet: z.string().nullable(),
        petAccessory: z.string().nullable(),
      }),
      z.object({
        characterGender: z.literal("female"),
        selectedCharacter: z.enum([
          "ivoryFemaleCharacter",
          "onyxFemaleCharacter",
          "bronzeFemaleCharacter",
          "sandstoneFemaleCharacter",
          "umberFemaleCharacter",
        ]),
        clothing: z.object({
          hat: z.string().nullable(),
          topBottom: z.string().nullable(),
          shoes: z.string().nullable(),
        }),
        hand: z.string().nullable(),
        hair: z.string().nullable(),
        coins: z.number(),
        highScore: z.number(),
        armor: z.number(),
        ownedItems: z.array(z.string().nullable()),
        pet: z.string().nullable(),
        petAccessory: z.string().nullable(),
      }),
    ]);


    export const loadGameConfig = async (): Promise<GameConfigType | null> => {
      const raw = window.localStorage.getItem("STRIDE_FALL_GAME_CONFIG");
      if (!raw) return null;
    
      let parsed;
      try {
        parsed = await decryptObject(raw);
      } catch (e) {
        console.error("Decryption or JSON parsing failed", e);
        window.localStorage.removeItem("STRIDE_FALL_GAME_CONFIG");
        return null;
      }
    
      const result = GameConfigSchema.safeParse(parsed);
    
      if (!result.success) {
        console.error(result.error);
        console.error("Game config validation failed");
        window.localStorage.removeItem("STRIDE_FALL_GAME_CONFIG");
        return null;
      }
    
      return result.data as GameConfigType;
    };
    
    export const saveGameConfig = async (config: GameConfigType) => {
      const encrypted = await encryptObject(config);
      window.localStorage.setItem("STRIDE_FALL_GAME_CONFIG", encrypted);
    };
    