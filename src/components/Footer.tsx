import MenuBox from "../assets/UI/PatternMiddleBottomBG_199x48.png"

const Footer = () => {
    return (
        <footer 
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-16 sm:h-20 z-10 flex items-center justify-center px-4"
            style={{
                backgroundImage: `url(${MenuBox})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: '100% 100%',
                width: '199px'
            }}
        >
            <div className="flex items-center justify-center w-full">
                <span className="text-white font-bold text-xs sm:text-sm drop-shadow-lg">
                    &copy;Copyright {new Date().getFullYear()}
                </span>
            </div>
        </footer>
    )
}

export default Footer