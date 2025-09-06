
import clothingConfigContext from "../clothingContext";
import PurchaseNotification from "./purchaseNotification";
import { useContext, useMemo, useCallback, useEffect, useRef, useState, type MouseEventHandler } from "react";
import {type Asset} from "../assetMap"
import titleBox from "../assets/UI/TitleBox_64x16.png"
import PriceBox from "./PriceBox";
import priceBox from "../assets/UI/Button_52x14.png";
import ArrowButtons from "./ArrowButtons";
import characterBg from "../assets/UI/ItemBox_24x24.png";


const useClothingConfig = () => {
    const context = useContext(clothingConfigContext);
    if (!context) {
      throw new Error(
        "useClothingConfig must be used within a ClothingConfigProvider"
      );
    }
    return context;
  };
  
  interface CustomizationItemPropsInterface {
    title: string;
    image?: string;
    price?: number;
    buyHandler?: MouseEventHandler<HTMLDivElement>;
    asset: Record<string, Asset>;
  }
  
  


const CustomizationItem = ({
    title,
    asset,
  }: CustomizationItemPropsInterface) => {
    const { myGender, mClothing, fClothing, ownedItems, purchaseItem } = useClothingConfig();
    const assetKeys = useMemo(() => Object.keys(asset), [asset]);
    
    const getInitialIndex = useCallback(() => {
      let key = title.toLowerCase();
      if (key === 'hats') {
        key = 'hat';
      } else if (key === 'hand item') {
        key = 'handItem';
      }
  
      const clothing = myGender === 'male' ? mClothing : fClothing;
      if (Object.prototype.hasOwnProperty.call(clothing, key)) {
        const selectedAsset = clothing[key as keyof typeof clothing];
        if (selectedAsset) {
          const index = assetKeys.indexOf(selectedAsset);
          if (index !== -1) {
            return index + 1; // +1 for "None" at index 0
          }
        }
      }
      return 0;
    }, [assetKeys, fClothing, mClothing, myGender, title]);
  
    useEffect(() => {
      if(title !== "pet accessories")
        setCurrentItemIndex(getInitialIndex());
    }, [asset, getInitialIndex, title])
  
    const [currentItemIndex, setCurrentItemIndex] = useState(0);
    const [purchaseMessage, setPurchaseMessage] = useState<{message: string, type: 'success' | 'error'} | null>(null);
    const isInitialMount = useRef(true);
    
    // Create the full list with null at index 0
    const totalItems = assetKeys.length + 1; // +1 for the null item
  
    // Get current item based on index
    let currentItem: Asset | null = null;
    if (currentItemIndex > 0) {
      const assetKey = assetKeys[currentItemIndex - 1];
      currentItem = asset[assetKey];
    }
  
    // Check if current item is owned
    const isItemOwned = currentItem ? ownedItems.includes(assetKeys[currentItemIndex - 1]) : true; // "None" is always owned
  
    useEffect(() => {
      if (isInitialMount.current) {
        isInitialMount.current = false;
        return;
      }
      
      
      if(title !== "pet accessories"){
        window.dispatchEvent(
          new CustomEvent("customizationAction", {
            detail: {
              action: "updateCustomizationItem",
              payload: {
                currentItem: currentItem,
                assetName: currentItem ? assetKeys[currentItemIndex - 1] : null,
                title: title.toLowerCase(),
              },
            },
          })
        );
      } else {
        window.dispatchEvent(
          new CustomEvent("petCustomizationAction", {
            detail: {
              action: "updateAccessory",
              payload: {
                currentItem: currentItem,
                assetName: currentItem ? assetKeys[currentItemIndex - 1] : null,
              }
            }
          })
        )
      }
    }, [currentItem, assetKeys, currentItemIndex, title, isItemOwned]);
  
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
      if (!currentItem) return;
      
      const itemName = assetKeys[currentItemIndex - 1];
      const success = purchaseItem(itemName, currentItem.price || 0);
      
      if (success) {
        setPurchaseMessage({
          message: `Successfully purchased ${itemName}!`,
          type: 'success'
        });
      } else {
        setPurchaseMessage({
          message: `Not enough coins to buy ${itemName}!`,
          type: 'error'
        });
      }
    };
  
    return (
      <div className="flex flex-col items-center">
        {purchaseMessage && (
          <PurchaseNotification
            message={purchaseMessage.message}
            type={purchaseMessage.type}
            onClose={() => setPurchaseMessage(null)}
          />
        )}
        
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
  
        <ArrowButtons
          leftArrowClick={handleLeftArrowClick}
          rightArrowClick={rightArrowClick}
        >
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
              <>
                <img
                  src={currentItem.icon}
                  alt={
                    currentItemIndex > 0 ? assetKeys[currentItemIndex - 1] : "empty"
                  }
                  className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
                  style={{
                    imageRendering: "pixelated",
                    transform: "scale(1.6)",
                    filter: !isItemOwned ? "grayscale(100%) brightness(0.5)" : "none"
                  }}
                />
                {!isItemOwned && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-red-500 text-2xl font-bold">🔒</div>
                  </div>
                )}
              </>
            ) : null}
          </div>
        </ArrowButtons>
  
        {/* Price Button - only show if item exists, has a price, and is not owned */}
        {currentItem?.price && !isItemOwned && (
          <PriceBox price={currentItem.price} clickHandler={buyHandler} />
        )}
        
        {/* Owned indicator */}
        {currentItem && isItemOwned && (
          <div
            className="relative px-2 py-1 mb-1"
            style={{
              backgroundImage: `url(${priceBox})`,
              backgroundSize: "100% 100%",
              backgroundRepeat: "no-repeat",
              imageRendering: "pixelated",
              minWidth: "52px",
              height: "14px",
              filter: "hue-rotate(120deg)"
            }}
          >
            <span
              className="text-white text-xs font-bold leading-none flex items-center justify-center h-full"
              style={{ textShadow: "1px 1px 0px #000" }}
            >
              OWNED
            </span>
          </div>
        )}
      </div>
    );
  };
  
  

export default CustomizationItem