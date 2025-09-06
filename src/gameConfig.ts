import { z } from "zod";
import { encryptObject, decryptObject } from "./cryptoUtils";

const GeneralConfigSchema = z.object({
  coins: z.number(),
  highScore: z.number(),
  armor: z.number(),
  ownedItems: z.array(z.string()),
  pet: z.string().nullable(),
  petAccessory: z.string().nullable(),
});

// Base clothing schema (all optional/nullable)
const ClothingBaseSchema = z.object({
  hat: z.string().nullable(),
  top: z.string().nullable().optional(),
  bottom: z.string().nullable().optional(),
  skirt: z.string().nullable().optional(),
  outfit: z.string().nullable().optional(),
  footwear: z.string().nullable(),
});

export const GameConfigSchema = z
  .object({
    characterGender: z.enum(["male", "female"]),
    selectedCharacter: z.string(),
    clothing: ClothingBaseSchema,
    hand: z.string().nullable(),
    hair: z.string().nullable(),
  })
  .merge(GeneralConfigSchema);

export type GameConfigType = z.infer<typeof GameConfigSchema>;

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
