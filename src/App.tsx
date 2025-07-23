import Game from "./components/Game"
import Controls from "./components/Controls"
import Footer from "./components/Footer"
import TopBar from "./components/Top"
import AppProvider from "./Context"

function App() {
  

  return (
    <main className="relative w-screen h-screen overflow-hidden">
      <AppProvider>
      <TopBar/>
      <Controls/>
      <Game/>
      <Footer/>
      </AppProvider>
    </main>
  )
}

export default App
