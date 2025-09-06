import { type FunctionComponent } from "react";
import titleBox from "../assets/UI/TitleBox_64x16.png";

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


export default CoinDisplay