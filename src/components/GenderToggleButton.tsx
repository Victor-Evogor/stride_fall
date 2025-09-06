import { type FunctionComponent} from "react"
import priceBox from "../assets/UI/Button_52x14.png";

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



export default GenderToggleButton