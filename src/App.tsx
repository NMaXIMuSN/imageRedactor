import './App.css'
import { FileContextProvider } from './components/context/FileContext/FileContextProvider'
import { ImageDataContextProvider } from './components/context/ImageDataContext/ImageDataContextProvider'
import { Footer } from './components/ui/Footer'
import { Header } from './components/ui/Header'
import { Main } from './components/ui/Main'
import { ThemeProvider } from './components/ui/theme-provider'

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <FileContextProvider>
        <ImageDataContextProvider>
          <div className='flex flex-col min-h-screen'>
            <Header/>
            <div className='container mt-4 flex-1'>
              <Main />
            </div>
            <Footer />
          </div>
        </ImageDataContextProvider>
      </FileContextProvider>
    </ThemeProvider>
  )
}

export default App
