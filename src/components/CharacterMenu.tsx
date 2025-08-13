import menuBg from "../assets/UI/RectangleBox_96x96.png";
import characterBg from "../assets/UI/ItemBox_24x24.png";
import petCompanionBg from "../assets/UI/HotkeyBox_34x34.png";
import priceBox from "../assets/UI/Button_52x14.png";
import titleBox from "../assets/UI/TitleBox_64x16.png";
import leftArrow from "../assets/UI/LeftArrowButton_7x10.png";
import rightArrow from "../assets/UI/RightArrowButton_7x10.png";
import cornerExitKnot from "../assets/UI/CornerKnot_14x14.png";
import {
  PetCustomizationScene,
  CharacterCustomizationScene,
} from "../scenes/CharacterCustomizationScene";
import { useAppContext } from "../AppContext";
import {
  useRef,
  useState,
  useEffect,
  type PropsWithChildren,
  type FunctionComponent,
  type MouseEventHandler,
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
  type Asset
} from "../assetMap";

interface CustomizationItemPropsInterface {
  title: string;
  image?: string;
  price?: number;
  buyHandler?: MouseEventHandler<HTMLDivElement>;
  asset: Record<string, Asset>
}

const CustomizationItem = ({
  title,
  asset,
}: CustomizationItemPropsInterface) => {
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  
  // Create the full list with null at index 0
  const assetKeys = Object.keys(asset);
  const totalItems = assetKeys.length + 1; // +1 for the null item
  
  // Get current item based on index
  let currentItem: Asset | null = null;
  if (currentItemIndex > 0) {
    const assetKey = assetKeys[currentItemIndex - 1];
    currentItem = asset[assetKey];
  }

  useEffect(() => {

    window.dispatchEvent(new CustomEvent("customizationAction", {
      detail: {
        action: "updateCustomizationItem",
        payload: {
          currentItem: currentItem,
          assetName: (currentItem ? assetKeys[currentItemIndex - 1] : null),
          title: title.toLowerCase()
        },
      },
    }))
  }, [currentItem, assetKeys, currentItemIndex, title]);
  
  const handleLeftArrowClick: MouseEventHandler<HTMLImageElement> = () => {
    setCurrentItemIndex((prevIndex) => {
      const newIndex = prevIndex === 0 ? totalItems - 1 : prevIndex - 1;
      return newIndex;
    });
  };
  
  const rightArrowClick: MouseEventHandler<HTMLImageElement> = () => {
    setCurrentItemIndex((prevIndex) => {
      const newIndex = (prevIndex + 1) % totalItems;
      return newIndex;
    });
  };
  
  const buyHandler = () => {
    // Handle purchase logic here
  };
  
  return (
    <div className="flex flex-col items-center">
      <div
        className="relative px-3 py-1 mb-2"
        style={{
          backgroundImage: `url(${titleBox})`,
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
          imageRendering: "pixelated",
          minWidth: "80px",
          height: "24px",
        }}
      >
        <span
          className="text-white text-xs font-bold leading-none flex items-center justify-center h-full uppercase"
          style={{ textShadow: "1px 1px 0px #000" }}
        >
          {title}
        </span>
      </div>
      
      <ArrowButtons leftArrowClick={handleLeftArrowClick} rightArrowClick={rightArrowClick}>
        <div
          className="relative mb-2"
          style={{
            backgroundImage: `url(${characterBg})`,
            backgroundSize: "100% 100%",
            backgroundRepeat: "no-repeat",
            imageRendering: "pixelated",
            width: "64px",
            height: "64px",
          }}
        >
          {currentItem ? (
            <img
              src={currentItem.icon}
              alt={currentItemIndex > 0 ? assetKeys[currentItemIndex - 1] : "empty"}
              className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
              style={{
                imageRendering: "pixelated",
                transform: "scale(1.6)",
              }}
            />
          ) : (
            null
          )}
        </div>
      </ArrowButtons>
      
      {/* Price Button - only show if item exists and has a price */}
      {currentItem?.price && (
        <PriceBox price={currentItem.price} clickHandler={buyHandler} />
      )}
    </div>
  );
};

const PriceBox: FunctionComponent<{
  price: number;
  clickHandler: MouseEventHandler<HTMLDivElement>;
}> = ({ price, clickHandler }) => {
  return (
    <div
      className="relative px-2 py-2 mb-1 cursor-pointer hover:scale-105 active:scale-95 transition-transform duration-100"
      style={{
        backgroundImage: `url(${priceBox})`,
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
        imageRendering: "pixelated",
        minWidth: "52px",
        height: "14px",
      }}
      onClick={clickHandler}
    >
      <span
        className="text-white text-xs font-bold leading-none flex items-center justify-center h-full"
        style={{ textShadow: "1px 1px 0px #000" }}
      >
        {price}G
      </span>
    </div>
  );
};

const CoinDisplay: FunctionComponent<{
  coinAmount: number;
}> = ({ coinAmount }) => {
  return (
    <div className="flex items-center justify-center mb-3">
      <div
        className="relative px-4 py-2 flex items-center gap-2"
        style={{
          backgroundImage: `url(${titleBox})`,
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
          imageRendering: "pixelated",
          minWidth: "120px",
          height: "28px",
        }}
      >
        {/* Coin icon - you can replace this with an actual coin sprite if you have one */}
        <div
          className="w-4 h-4 rounded-full border-2 border-yellow-400 bg-yellow-300 flex items-center justify-center"
          style={{
            boxShadow:
              "inset 0 1px 2px rgba(255,255,255,0.3), 0 1px 2px rgba(0,0,0,0.3)",
          }}
        >
          <span className="text-xs font-bold text-yellow-800">G</span>
        </div>
        <span
          className="text-white text-sm font-bold leading-none flex-1 text-center"
          style={{ textShadow: "1px 1px 0px #000" }}
        >
          {coinAmount.toLocaleString()}
        </span>
      </div>
    </div>
  );
};

const ArrowButtons: FunctionComponent<
  PropsWithChildren<{
    leftArrowClick?: MouseEventHandler<HTMLImageElement>;
    rightArrowClick?: MouseEventHandler<HTMLImageElement>;
  }>
> = ({ children, leftArrowClick, rightArrowClick }) => {
  return (
    <div className="flex items-center justify-center gap-2">
      <img
        src={leftArrow}
        alt="Left Arrow"
        className="cursor-pointer transition-transform duration-100 hover:scale-110 active:scale-95 w-4 z-10"
        style={{ imageRendering: "pixelated" }}
        onClick={leftArrowClick}
      />
      {children}
      <img
        src={rightArrow}
        alt="Right Arrow"
        className="cursor-pointer transition-transform duration-100 hover:scale-110 active:scale-95 w-4 z-10"
        style={{ imageRendering: "pixelated" }}
        onClick={rightArrowClick}
      />
    </div>
  );
};

const GenderToggleButton: FunctionComponent<{
  gender: "male" | "female";
  isActive: boolean;
  isDisabled: boolean;
  onClick: () => void;
}> = ({ gender, isActive, isDisabled, onClick }) => {
  return (
    <div
      className={`relative px-3 py-1 transition-all duration-150 ${
        isDisabled
          ? "cursor-not-allowed opacity-50"
          : "cursor-pointer hover:scale-105 active:scale-95"
      }`}
      style={{
        backgroundImage: `url(${priceBox})`,
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
        imageRendering: "pixelated",
        minWidth: "40px",
        height: "20px",
        filter: isDisabled
          ? "brightness(0.6) saturate(0.5)"
          : isActive
          ? "brightness(1.2)"
          : "brightness(1)",
      }}
      onClick={!isDisabled ? onClick : undefined}
    >
      <span
        className={`text-white text-sm font-bold leading-none flex items-center justify-center h-full ${
          isActive ? "text-yellow-200" : "text-white"
        }`}
        style={{ textShadow: "1px 1px 0px #000" }}
      >
        {gender.toUpperCase()}
      </span>
    </div>
  );
};

const AcceptButton: FunctionComponent<{
  onClick: () => void;
}> = ({ onClick }) => {
  return (
    <div
      className="relative px-6 py-2 cursor-pointer transition-transform duration-150 hover:scale-105 active:scale-95"
      style={{
        backgroundImage: `url(${titleBox})`,
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
        imageRendering: "pixelated",
        minWidth: "120px",
        height: "32px",
      }}
      onClick={onClick}
    >
      <span
        className="text-white text-sm font-bold leading-none flex items-center justify-center h-full"
        style={{ textShadow: "1px 1px 0px #000" }}
      >
        APPLY CHANGES
      </span>
    </div>
  );
};

const CharacterMenu = () => {
  const characterCustomizationRef = useRef<HTMLDivElement>(null);
  const petCustomizationRef = useRef<HTMLDivElement>(null);
  const isScenesMountedRef = useRef<boolean>(false);

  const [_, setCharacterSelectIndex] = useState(0);

  const characterColors = ["ivory", "onyx", "bronze", "sandstone", "umber"];

  const {
    setIsCharacterCustomizeMenuOpen,
    gameConfig: { characterGender, coins },
    // setGameConfig,
  } = useAppContext();
  const [myGender, setMyGender] = useState(characterGender);

  const isMale = myGender === "male";
  const isFemale = myGender === "female";

  const closeCharacterMenu = () => {
    setIsCharacterCustomizeMenuOpen(false);
  };

  const handleGenderToggle = (gender: "male" | "female") => {
    if (gender !== myGender) {
      setMyGender(() => {
        window.dispatchEvent(
          new CustomEvent("customizationAction", {
            detail: {
              action: "genderChange",
              payload: {
                gender,
              },
            },
          })
        );

        return gender;
      });
    }
  };

  const handleAcceptChanges = () => {
    // Here you can add any logic to save/apply the customization changes
    console.log("Character customization changes accepted");
    // For now, just close the menu
    closeCharacterMenu();
  };

  const handleCharacterSpriteLeftArrowClick = () => {
    setCharacterSelectIndex((prevIndex) => {
      if (prevIndex === 0) {
        const newIndex = characterColors.length - 1;
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

    return () => {
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
              <ArrowButtons />
            </div>

            {/* RIGHT: Customization Options */}
            <div className="flex-1 grid grid-rows-3 grid-cols-3 gap-3">
              {/* HATS */}
              <CustomizationItem
                title="HATS"
                asset={hats}
              />

              {isMale &&
                maleAssetsCategory.map((item, index) => (
                  <CustomizationItem title={item.title} asset={item.asset} key={item.title + index}/>
                ))}

              {isFemale &&
                femaleAssetCategories.map((item, index) => (
                  <CustomizationItem title={item.title} asset={item.asset} key={item.title + index}/>
                ))}

              {/* FOOTWEAR */}
              <CustomizationItem  title="footwear" asset={isMale? maleFootwear : femaleFootwear}/>

              {/* HAND ITEM */}
              <CustomizationItem  title="hand item" asset={isMale? maleHand : femaleHand}/>

              {/* HAIR */}
              <CustomizationItem title="hair" asset={isMale ? maleHair : femaleHair}/>

              {/* PET ACCESSORIES */}
              <CustomizationItem title="pet accessories" asset={petAccessories}/>
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
