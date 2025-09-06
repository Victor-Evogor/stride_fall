import {type FunctionComponent} from "react"
import titleBox from "../assets/UI/TitleBox_64x16.png"

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


export default AcceptButton