import Game from "./components/Game"
import MainMenu from "./components/MainMenu"
import TopBar from "./components/Top"
import Timer from "./components/Timer"
import PauseMenu from "./components/PauseMenu"
import CharacterMenu from "./components/CharacterMenu"
import InfoMenu from "./components/InfoMenu" 
import { useAppContext } from "./AppContext"

function App() {
  const {
    isCharacterCustomizeMenuOpen,
    isInfoMenuOpen,   // 👈 bring from context
  } = useAppContext()

  return (
    <main className="relative w-screen h-screen overflow-hidden">
      <Timer/>
      <TopBar/>
      <MainMenu/>
      <Game/>
      <PauseMenu/>

      {isCharacterCustomizeMenuOpen ? <CharacterMenu/> : null}
      {isInfoMenuOpen ? <InfoMenu/> : null}   
    </main>
  )
}

export default App
