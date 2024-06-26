import './App.css'
import { CanvasContextProvider } from './components/context/CanvasContext/CanvasContextProvider'
import { EyedropperContextProvider } from './components/context/EyedropperContext/EyedropperContextProvider'
import { FileContextProvider } from './components/context/FileContext/FileContextProvider'
import { ImageDataContextProvider } from './components/context/ImageDataContext/ImageDataContextProvider'
import { Footer } from './components/ui/Footer'
import { Header } from './components/ui/Header'
import { Main } from './components/ui/Main'
import { ThemeProvider } from './components/ui/theme-provider'

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <CanvasContextProvider>
        <FileContextProvider>
          <ImageDataContextProvider>
            <EyedropperContextProvider>
              <div className='flex flex-col min-h-screen'>
                <Header/>
                <div className='mt-4 h-[calc(100vh_-_50px_-_50px_-_16px_-_16px)]'>
                  <Main />
                </div>
                <Footer />
              </div>
            </EyedropperContextProvider>
          </ImageDataContextProvider>
        </FileContextProvider>
      </CanvasContextProvider>
    </ThemeProvider>
  )
}

export default App
