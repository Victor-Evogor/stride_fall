import menuBg from "../assets/UI/RectangleBox_96x96.png";
import characterBg from "../assets/UI/ItemBox_24x24.png";
import petCompanionBg from "../assets/UI/HotkeyBox_34x34.png";
import cornerExitKnot from "../assets/UI/CornerKnot_14x14.png";
import CoinDisplay from "./CoinDisplay";
import {
  PetCustomizationScene,
  CharacterCustomizationScene,
} from "../scenes/CharacterCustomizationScene";
import { useAppContext } from "../AppContext";
import {
  useRef,
  useState,
  useEffect,
  useCallback
} from "react";
import Phaser from "phaser";
import {
  hats,
  femaleSkirt,
  femaleOutfit,
  femaleHair,
  femaleHand,
  maleTopClothing,
  maleBottomClothing,
  maleHair,
  maleHand,
  petAccessories,
  femaleFootwear,
  maleFootwear,
  petCompanions,
  
} from "../assetMap";
import PriceBox from "./PriceBox";
import { type fClothingType, type mClothingType } from "../types";
import CustomizationItem from "./CustomizationItem";
import GenderToggleButton from "./GenderToggleButton";
import AcceptButton from "./AcceptButton";
import ArrowButtons from "./ArrowButtons";
import clothingConfigContext from "../clothingContext";
import { saveGameConfig, type GameConfigType } from "../gameConfig";


const CharacterMenu = () => {
  const characterCustomizationRef = useRef<HTMLDivElement>(null);
  const petCustomizationRef = useRef<HTMLDivElement>(null);
  const isScenesMountedRef = useRef<boolean>(false);

  
  const [characterColor, setCharacterColor] = useState({
    male: "sandstone",
    female: "sandstone"
  })
  const setPetSelectIndex = useState(0)[1]

  const characterColors = ["ivory", "onyx", "bronze", "sandstone", "umber"];

  const [mClothing, setMClothing] = useState<mClothingType>({
    hat: null,
    hair: null,
    top: null,
    bottom: null,
    footwear: null,
    handItem: null,
  });
  const [fClothing, setFClothing] = useState<fClothingType>({
    hat: null,
    hair: null,
    outfit: null,
    skirt: null,
    footwear: null,
    handItem: null,
  });

  const {
    setIsCharacterCustomizeMenuOpen,
    // gameConfig: { characterGender, coins, ownedItems },
    gameConfig,
    setGameConfig,
  } = useAppContext();
  const {characterGender, coins, ownedItems, selectedCharacter} = gameConfig
  const  [characterIndex, setCharacterSelectIndex] = useState(characterColors.indexOf(selectedCharacter.split(characterGender === "male"? "Male": "Female")[0]));
  const [myGender, setMyGender] = useState(characterGender);

  const isMale = myGender === "male";
  const isFemale = myGender === "female";


  useEffect(()=> {
    console.log("Character index", characterIndex)
  }, [characterIndex])

  const closeCharacterMenu = () => {
    setIsCharacterCustomizeMenuOpen(false);
  };

  const purchaseItem = useCallback((itemName: string, price: number): boolean => {
    if (coins >= price && !ownedItems.includes(itemName)) {
      // setCoins(prev => prev - price);
      // setOwnedItems(prev => [...prev, itemName]);
      
      // Update game config
      setGameConfig(prev => ({
        ...prev,
        coins: prev.coins - price,
        ownedItems: [...(prev.ownedItems || []), itemName]
      }));
      
      return true;
    }
    return false;
  }, [coins, ownedItems, setGameConfig]);

  useEffect(() => {
    const handleCustomizationAction = (e: Event) => {
      const event = e as CustomEvent;
      const action = event.detail.action;
      console.log("handleCustomizationAction fired");
      if (action === "updateCustomizationItem") {
        const title = event.detail.payload.title;
        const assetName = event.detail.payload.assetName;
        let key = title;
        if (key === "hats") {
          key = "hat";
        } else if (key === "hand item") {
          key = "handItem";
        }

        if (myGender === "male") {
          setMClothing((prev) => {
            if (Object.prototype.hasOwnProperty.call(prev, key)) {
              return {
                ...prev,
                [key]: assetName,
              };
            }
            return prev;
          });
        } else if (myGender === "female") {
          setFClothing((prev) => {
            if (Object.prototype.hasOwnProperty.call(prev, key)) {
              return {
                ...prev,
                [key]: assetName,
              };
            }
            return prev;
          });
        }
      }
    };
    window.addEventListener(
      "customizationAction",
      handleCustomizationAction as EventListener
    );
    return () => {
      window.removeEventListener(
        "customizationAction",
        handleCustomizationAction as EventListener
      );
    };
  }, [myGender, setMClothing, setFClothing]);


  const handleGenderToggle = (gender: "male" | "female") => {
    if (gender !== myGender) {
      setCharacterSelectIndex(0)
      setMyGender(() => {
        window.dispatchEvent(
          new CustomEvent("customizationAction", {
            detail: {
              action: "genderChange",
              payload: {
                gender,
                mClothing: mClothing,
                fClothing: fClothing,
                color: gender === "male" ? characterColor.male : characterColor.female
              },
            },
          })
        );

        return gender;
      });
    }
  };

  const handleAcceptChanges = () => {
    setGameConfig(prev => {
      const clothingInput = myGender === "male" ? mClothing : fClothing;
  
      // utility to validate item
      const ensureOwned = (item: string | null, prevItem: string | null) => {
        if (item === null) return null; // leave nulls untouched
        return ownedItems.includes(item) ? item : prevItem;
      };
  
      // iterate over clothing keys safely
      const validatedClothing = Object.keys(clothingInput).reduce(
        (acc, key) => {
          const k = key as keyof typeof clothingInput;
          const newValue = clothingInput[k];
          const prevValue =
            prev.clothing[k as keyof typeof prev.clothing] ?? null;
          acc[k] = ensureOwned(newValue, prevValue);
          return acc;
        },
        {} as typeof clothingInput
      );
  
      const newConfig: GameConfigType = {
        ...prev,
        selectedCharacter:
          characterColors[characterIndex] +
          (myGender === "male" ? "MaleCharacter" : "FemaleCharacter"),
        characterGender: myGender,
        clothing: validatedClothing,
        hand: ensureOwned(clothingInput.handItem, prev.hand),
        hair: ensureOwned(clothingInput.hair, prev.hair),
      };

      window.dispatchEvent(new CustomEvent("newChanges", {
        detail: newConfig
      }))
  
      saveGameConfig(newConfig)
  
      return newConfig;
    });
  
    closeCharacterMenu();
  };
  
  

  const handleCharacterSpriteLeftArrowClick = () => {
    setCharacterSelectIndex((prevIndex) => {
      if (prevIndex === 0) {
        const newIndex = characterColors.length - 1;
        setCharacterColor((prevColor) => ({
          ...prevColor,
          [myGender]: characterColors[newIndex % characterColors.length],
        }));
        window.dispatchEvent(
          new CustomEvent("customizationAction", {
            detail: {
              action: "changeCharacterColor",
              payload: {
                currentCharacterColor:
                  characterColors[newIndex % characterColors.length],
              },
            },
          })
        );
        return newIndex;
      } else {
        const newIndex = prevIndex - 1;
        setCharacterColor((prevColor) => ({
          ...prevColor,
          [myGender]: characterColors[newIndex % characterColors.length],
        }));
        window.dispatchEvent(
          new CustomEvent("customizationAction", {
            detail: {
              action: "changeCharacterColor",
              payload: {
                currentCharacterColor:
                  characterColors[newIndex % characterColors.length],
              },
            },
          })
        );
        return newIndex;
      }
    });
  };

  const handleCharacterSpriteRightArrowClick = () => {
    setCharacterSelectIndex((prevIndex) => {
      const newIndex = prevIndex + 1;
      setCharacterColor((prevColor) => ({
        ...prevColor,
        [myGender]: characterColors[newIndex % characterColors.length],
      }));
      window.dispatchEvent(
        new CustomEvent("customizationAction", {
          detail: {
            action: "changeCharacterColor",
            payload: {
              currentCharacterColor:
                characterColors[newIndex % characterColors.length],
            },
          },
        })
      );
      return newIndex;
    });
  };

  const handlePetSpriteRightArrowClick = () => {
    setPetSelectIndex((prevIndex) => {
      const newIndex = prevIndex + 1;
      window.dispatchEvent(
        new CustomEvent("petCustomizationAction", {
          detail: {
            action: "characterChange",
            payload: {
              character: Object.keys(petCompanions)[newIndex % Object.keys(petCompanions).length],
            },
          },
        })
      )

      return newIndex
      })
  }

  const handlePetSpriteLeftArrowClick = () => {
    setPetSelectIndex((prevIndex) => {
      let newIndex = 0
      if (prevIndex === 0) {
        newIndex = Object.keys(petCompanions).length - 1;
        window.dispatchEvent(
          new CustomEvent("petCustomizationAction", {
            detail: {
              action: "characterChange",
              payload: {
                character: Object.keys(petCompanions)[newIndex % Object.keys(petCompanions).length],
              },
            },
          })
        );
      } else {
        newIndex = prevIndex - 1;
        window.dispatchEvent(
          new CustomEvent("petCustomizationAction", {
            detail: {
              action: "characterChange",
              payload: {
                character: Object.keys(petCompanions)[newIndex % Object.keys(petCompanions).length],
              },
            },
          })
        );
      }
      return newIndex;

    })
  }

  useEffect(() => {
    if (!characterCustomizationRef.current || !petCustomizationRef.current)
      return;
    if (isScenesMountedRef.current) return;
    isScenesMountedRef.current = true;
    const characterCustomizationConfig: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: characterCustomizationRef.current.clientWidth,
      height: characterCustomizationRef.current.clientHeight,
      parent: characterCustomizationRef.current,
      scene: CharacterCustomizationScene,
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      render: {
        antialias: false,
        pixelArt: true,
      },
    };
    const companionCustomizationConfig: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: petCustomizationRef.current.clientWidth,
      height: petCustomizationRef.current.clientHeight,
      parent: petCustomizationRef.current,
      scene: PetCustomizationScene,
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      render: {
        antialias: false,
        pixelArt: true,
      },
    };

    const characterCustomizationGame = new Phaser.Game(
      characterCustomizationConfig
    );
    const companionCustomizationGame = new Phaser.Game(
      companionCustomizationConfig
    );

    const handleCharacterCustomizationMountEvent = () => {
      if (gameConfig.characterGender === "male"){
        const newClothing: mClothingType = {
          hair: gameConfig.hair || null,
          bottom: gameConfig.clothing.bottom || null,
          footwear: gameConfig.clothing.footwear || null,
          handItem: gameConfig.hand || null,
          hat: gameConfig.clothing.hat || null,
          top: gameConfig.clothing.top || null,
        };
      
        

        window.dispatchEvent(
          new CustomEvent("customizationAction", {
            detail: {
              action: "genderChange",
              payload: {
                gender: "male",
                mClothing: newClothing,
                fClothing: fClothing,
                color: gameConfig.selectedCharacter.split("Male")[0]
              },
            },
          })
        );
      
        // Finally update the state
        setMClothing(newClothing);
        
      } else {
        const newClothing: fClothingType = {
          hair: gameConfig.hair || null,
          handItem: gameConfig.hand || null,
          footwear: gameConfig.clothing.footwear || null,
          hat: gameConfig.clothing.hat || null,
          outfit: gameConfig.clothing.outfit || null,
          skirt: gameConfig.clothing.skirt || null,
        };
      

        window.dispatchEvent(
          new CustomEvent("customizationAction", {
            detail: {
              action: "genderChange",
              payload: {
                gender: "female",
                fClothing: newClothing,
                mClothing: mClothing,
                color: gameConfig.selectedCharacter.split("Female")[0]
              },
            },
          })
        );
      
        // Finally update the state
        setFClothing(newClothing);
      }
    }

    window.addEventListener("characterCustomizationSceneReady", handleCharacterCustomizationMountEvent)

    return () => {
      window.removeEventListener("characterCustomizationSceneReady", handleCharacterCustomizationMountEvent)
      characterCustomizationGame.destroy(true);
      companionCustomizationGame.destroy(true);
    };
  }, []);

  const maleAssetsCategory = [
    {
      title: "TOP",
      asset: maleTopClothing,
    },
    {
      title: "BOTTOM",
      asset: maleBottomClothing,
    },
  ];

  const femaleAssetCategories = [
    {
      title: "outfit",
      asset: femaleOutfit,
    },
    {
      title: "skirt",
      asset: femaleSkirt,
    },
  ];

  return (
    <div className="absolute inset-0 flex items-center justify-center z-10 p-4">
      {/* Main Menu Container */}
      <div
        className="relative p-6 select-none"
        style={{
          backgroundImage: `url(${menuBg})`,
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
          imageRendering: "pixelated",
          minWidth: "600px",
          minHeight: "500px",
        }}
      >
        {/* Exit Knot */}
        <img
          src={cornerExitKnot}
          alt="Exit"
          onClick={closeCharacterMenu}
          className="absolute -top-2 -right-2 cursor-pointer transition-transform duration-150 hover:scale-110 active:scale-95 z-20"
          style={{
            imageRendering: "pixelated",
            width: "28px",
            height: "28px",
          }}
        />

        {/* Content Container with Purple Background */}
        <div
          className="w-full h-full p-4 flex flex-col gap-4"
          style={{
            backgroundColor: "#6b4c8a",
            border: "3px solid #8b6914",
            borderRadius: "8px",
          }}
        >
          {/* Coin Display */}
          <CoinDisplay coinAmount={coins} />

          {/* Gender Toggle Buttons */}
          <div className="flex justify-center gap-4 mb-2">
            <GenderToggleButton
              gender="male"
              isActive={isMale}
              isDisabled={isMale}
              onClick={() => handleGenderToggle("male")}
            />
            <GenderToggleButton
              gender="female"
              isActive={isFemale}
              isDisabled={isFemale}
              onClick={() => handleGenderToggle("female")}
            />
          </div>

          {/* Main Content */}
          <div className="flex gap-6 flex-1">
            {/* LEFT: Character and Pet Display */}
            <div className="flex flex-col items-center gap-4 min-w-[120px]">
              {/* Character Display */}
              <div
                className="relative p-2"
                style={{
                  backgroundImage: `url(${characterBg})`,
                  backgroundSize: "100% 100%",
                  backgroundRepeat: "no-repeat",
                  imageRendering: "pixelated",
                  width: "80px",
                  height: "140px",
                }}
              >
                <div
                  ref={characterCustomizationRef}
                  className="w-full h-full"
                  style={{ imageRendering: "pixelated" }}
                >
                  {/* Character sprite */}
                </div>
              </div>
              <ArrowButtons
                leftArrowClick={handleCharacterSpriteLeftArrowClick}
                rightArrowClick={handleCharacterSpriteRightArrowClick}
              />

              {/* Pet Display */}
              <div
                className="relative p-2"
                style={{
                  backgroundImage: `url(${petCompanionBg})`,
                  backgroundSize: "100% 100%",
                  backgroundRepeat: "no-repeat",
                  imageRendering: "pixelated",
                  width: "80px",
                  height: "80px",
                }}
              >
                <div
                  ref={petCustomizationRef}
                  className="w-full h-full"
                  style={{ imageRendering: "pixelated" }}
                >
                  {/* Pet sprite */}
                </div>
              </div>
              {<PriceBox price={100} clickHandler={() => ({})} />}
              <ArrowButtons rightArrowClick={handlePetSpriteRightArrowClick} leftArrowClick={handlePetSpriteLeftArrowClick}/>
            </div>

            {/* RIGHT: Customization Options */}
            <div className="flex-1 grid grid-rows-3 grid-cols-3 gap-3">
              <clothingConfigContext.Provider
                value={{ mClothing, fClothing, setMClothing, setFClothing, myGender, setMyGender, ownedItems, purchaseItem }}
              >
                {/* HATS */}
                {isMale? <CustomizationItem title="HATS" asset={hats} /> : <CustomizationItem title="HATS" asset={hats} />}
                

                {isMale &&
                  maleAssetsCategory.map((item, index) => (
                    <CustomizationItem
                      title={item.title}
                      asset={item.asset}
                      key={item.title + index}
                    />
                  ))}

                {isFemale &&
                  femaleAssetCategories.map((item, index) => (
                    <CustomizationItem
                      title={item.title}
                      asset={item.asset}
                      key={item.title + index}
                    />
                  ))}

                {/* FOOTWEAR */}
                {isMale? <CustomizationItem
                  title="footwear"
                  asset={maleFootwear}
                /> : <CustomizationItem
                title="footwear"
                asset={femaleFootwear}
              />}
                

                {/* HAND ITEM */}
                {isMale ? <CustomizationItem
                  title="hand item"
                  asset={maleHand}
                /> : <CustomizationItem
                title="hand item"
                asset={femaleHand}
              />}
                

                {/* HAIR */}
                {isMale ? <CustomizationItem
                  title="hair"
                  asset={maleHair}
                /> : <CustomizationItem
                title="hair"
                asset={femaleHair}
              />}
                

                {/* PET ACCESSORIES */}
                <CustomizationItem
                  title="pet accessories"
                  asset={petAccessories}
                />
              </clothingConfigContext.Provider>
            </div>
          </div>

          {/* Accept Button at the bottom */}
          <div className="flex justify-center mt-4">
            <AcceptButton onClick={handleAcceptChanges} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterMenu;
