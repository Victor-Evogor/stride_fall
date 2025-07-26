import TopPattern from "../assets/UI/TopPatternPanel_02_33x15.png";

const TopBar = () => {
    return (
        <header 
            className="left-1/2 -translate-x-1/2 absolute flex justify-center items-center py-6 overflow-hidden select-none"
        >
            <span 
                style={{
                    position: 'relative',
                    zIndex: 2, 
                }}
                className="pixelify-sans-400 text-[#ba9158] text-5xl font-bold tracking-wider uppercase drop-shadow-lg"
            >
                Stride Fall
            </span>
            <img 
                src={TopPattern} 
                alt="Decorative pattern" 
                style={{
                    position: 'absolute',
                    bottom: 0, 
                    left: '50%', 
                    transform: 'translateX(-50%)', 
                    width: 'auto', 
                    height: '15px', 
                    zIndex: 1 
                }}
            />
        </header>
    )
}

export default TopBar;