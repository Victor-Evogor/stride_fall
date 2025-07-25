import Game from "./components/Game"
import Controls from "./components/Controls"
import Footer from "./components/Footer"
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
      <Footer/>
      </AppProvider>
    </main>
  )
}

export default App
