import { type FunctionComponent, type MouseEventHandler } from "react";
import priceBox from "../assets/UI/Button_52x14.png";


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

export default PriceBox