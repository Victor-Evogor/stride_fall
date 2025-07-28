import Game from "./components/Game"
import MainMenu from "./components/MainMenu"
import TopBar from "./components/Top"
import AppProvider from "./ContextProvider"
import Timer from "./components/Timer"

function App() {
  

  return (
    <main className="relative w-screen h-screen overflow-hidden">
      <AppProvider>
        <Timer/>
      <TopBar/>
      <MainMenu/>
      <Game/>
      </AppProvider>
    </main>
  )
}

export default App
