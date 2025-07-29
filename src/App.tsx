import Game from "./components/Game"
import MainMenu from "./components/MainMenu"
import TopBar from "./components/Top"
import AppProvider from "./ContextProvider"
import Timer from "./components/Timer"
import PauseMenu from "./components/PauseMenu"

function App() {
  

  return (
    <main className="relative w-screen h-screen overflow-hidden">
      <AppProvider>
        <Timer/>
      <TopBar/>
      <MainMenu/>
      <Game/>
      <PauseMenu/>
      </AppProvider>
    </main>
  )
}

export default App
