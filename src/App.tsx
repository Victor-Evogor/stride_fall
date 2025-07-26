import Game from "./components/Game"
import Controls from "./components/Controls"
import TopBar from "./components/Top"
import AppProvider from "./ContextProvider"
import Timer from "./components/Timer"

function App() {
  

  return (
    <main className="relative w-screen h-screen overflow-hidden">
      <AppProvider>
        <Timer/>
      <TopBar/>
      <Controls/>
      <Game/>
      </AppProvider>
    </main>
  )
}

export default App
