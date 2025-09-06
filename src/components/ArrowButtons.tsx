import {type FunctionComponent, type PropsWithChildren, type MouseEventHandler} from "react"
import leftArrow from "../assets/UI/LeftArrowButton_7x10.png";
import rightArrow from "../assets/UI/RightArrowButton_7x10.png";

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


export default ArrowButtons