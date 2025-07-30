type MaleCharacters =
  | "ivoryMaleCharacter"
  | "onyxMaleCharacter"
  | "bronzeMaleCharacter"
  | "sandstoneMaleCharacter"
  | "umberMaleCharacter";

type FemaleCharacters =
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
  | "topless";

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
  | "default_underwear";

type MaleShoes = "boots" | "shoes" | "barefoot";

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
  | "none";

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
  | "barehands";

type MaleHairs = "black" | "blond" | "brown" | "golden" | "red" | "none";

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
  | "default";

type FemaleFootwear =
  | "boots"
  | "green_socks"
  | "orange_socks"
  | "purple_socks"
  | "red_socks"
  | "skyblue_socks"
  | "silverblue_socks"
  | "none";

type FemaleBottomClothings = "skirt" | "none";

type FemaleHair = "black" | "blond" | "brown" | "golden" | "red" | "none";

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
  | "none";



type Pets = 
  | "luna"
  | "milo"
  | "nova"
  | "rusty"
  | "maple"

type PetAccessories = 
  | "dog_backpack"
  | "dog_hat"

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
    | PetAccessories
    | Pets
  )[];
  pet: Pets | null;
  petAccessories: PetAccessories | null;
}

type GameConfigType =
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

export const loadGameConfig = () => {
  const config = JSON.parse(window.localStorage.getItem("STRIDE_FALL_GAME_CONFIG") ?? "{}");
  return config as GameConfigType;
};

export const saveGameConfig = (config: GameConfigType) => {
  window.localStorage.setItem("STRIDE_FALL_GAME_CONFIG", JSON.stringify(config));
};
