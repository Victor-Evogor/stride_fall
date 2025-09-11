import rectangleBg from "../assets/UI/RectangleBox_96x96.png"
import paperBg from "../assets/panelInset_brown.png"
import { useAppContext } from "../AppContext"
import cornerExitKnot from "../assets/UI/CornerKnot_14x14.png"

const InfoMenu = () => {
  const { setIsInfoMenuOpen } = useAppContext()

  const closeMenu = () => {
    setIsInfoMenuOpen(false)
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center z-20 p-4">
      {/* Outer Rectangle Frame */}
      <div
        className="relative select-none flex items-center justify-center"
        style={{
          backgroundImage: `url(${rectangleBg})`,
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
          imageRendering: "pixelated",
          minWidth: "500px",
          minHeight: "400px",
          maxWidth: "700px",
          maxHeight: "550px",
          padding: "30px",
        }}
      >
        {/* Exit Button */}
        <img
          src={cornerExitKnot}
          alt="Close"
          onClick={closeMenu}
          className="absolute -top-2 -right-2 cursor-pointer transition-transform duration-150 hover:scale-110 active:scale-95 z-20"
          style={{
            imageRendering: "pixelated",
            width: "28px",
            height: "28px",
          }}
        />

        {/* Inner Paper */}
        <div
          className="w-full h-full overflow-y-auto text-black space-y-6"
          style={{
            backgroundImage: `url(${paperBg})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            imageRendering: "pixelated",
            borderRadius: "10px",
            padding: "20px",
            maxWidth: "550px", // 👈 keeps it narrow
            margin: "0 auto",
          }}
        >
          {/* Gameplay Section */}
          <section>
            <h2 className="text-lg font-bold mb-2">Gameplay</h2>
            <p className="leading-relaxed">
              Tap the <span className="font-semibold">spacebar</span> to jump over mobs and collect rewards.  
              Use collected coins to customize your character and unlock new skins and assets.
            </p>
          </section>

          {/* Credits Section */}
          <section>
            <h2 className="text-lg font-bold mb-2">Credits</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>
                Game Developer: (
                <a
                  href="https://x.com/victorevogor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-blue-700 hover:text-blue-900"
                >
                  @victorevogor
                </a>
                )
              </li>
              <li>
                Characters & assets:{" "}
                <a
                  href="https://x.com/GandaIfHardcore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-blue-700 hover:text-blue-900"
                >
                  @GandaIfHardcore
                </a>
              </li>
              <li>
                UI:{" "}
                <a
                  href="https://etahoshi.itch.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-blue-700 hover:text-blue-900"
                >
                  etahoshi
                </a>
              </li>
              <li>
                Flying bird:{" "}
                <a
                  href="https://toffeecraft.itch.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-blue-700 hover:text-blue-900"
                >
                  toffeecraft
                </a>
              </li>
              <li>
                Mouse cursor & UI boxes:{" "}
                <a
                  href="https://twitter.com/KenneyNL"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-blue-700 hover:text-blue-900"
                >
                  @KenneyNL
                </a>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}

export default InfoMenu
