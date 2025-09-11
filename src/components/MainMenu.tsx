import buttonBg from "../assets/UI/Button_52x14.png"
import buttonHighlight from "../assets/UI/HighlightButton_60x23.png"
import rectangeBg from "../assets/UI/RectangleBox_96x96.png"
import { useAppContext } from "../AppContext"

const MainMenu = () => {
    const { isGameStarted, setIsGameStarted, isCharacterCustomizeMenuOpen, setIsCharacterCustomizeMenuOpen, setIsInfoMenuOpen } = useAppContext()
    if (isGameStarted || isCharacterCustomizeMenuOpen) return null; // Don't render controls when the game is playing
    const buttons = [
        { label: 'START', action: () => setIsGameStarted(true) },
        { label: 'CHARACTER', action: () => setIsCharacterCustomizeMenuOpen(true) },
        { label: 'INFO', action: () => setIsInfoMenuOpen(true) }
    ]

    return (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col gap-y-4 sm:gap-6 p-12 select-none" style={{
            backgroundImage: `url(${rectangeBg})`,
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
            imageRendering: 'pixelated'
        }}>
            {
                buttons.map(({label, action}, index) => (
                    <button 
                        key={index}
                        className="group relative w-20 h-8 sm:w-24 sm:h-10 active:scale-95 transform transition-all duration-150"
                style={{
                    backgroundImage: `url(${buttonBg})`,
                    backgroundSize: '100% 100%',
                    backgroundRepeat: 'no-repeat',
                    imageRendering: 'pixelated'
                }}
                onClick={action}
            >
                <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{
                        backgroundImage: `url(${buttonHighlight})`,
                        backgroundSize: '100% 100%',
                        backgroundRepeat: 'no-repeat',
                        imageRendering: 'pixelated',
                        transform: 'scale(1.15)'
                    }}
                ></div>
                <span className="relative flex items-center justify-center h-full font-bold text-white text-xs sm:text-sm drop-shadow-lg uppercase">
                    {label}
                </span>
            </button>))
            }
            
        </div>
    )
}

export default MainMenu