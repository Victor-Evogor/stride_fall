import { createContext, type Dispatch, type SetStateAction } from "react";
import { type fClothingType, type mClothingType } from "./types";


const clothingConfigContext = createContext<{
  mClothing: mClothingType;
  fClothing: fClothingType;
  setMClothing: Dispatch<SetStateAction<mClothingType>>;
  setFClothing: Dispatch<SetStateAction<fClothingType>>;
  myGender: "male" | "female";
  setMyGender: Dispatch<SetStateAction<"male" | "female">>;
  ownedItems: string[];
  purchaseItem: (itemName: string, price: number) => boolean
} | null>(null);



export default clothingConfigContext