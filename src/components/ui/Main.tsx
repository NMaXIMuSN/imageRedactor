import { useContext, } from "react"
import { FileContext } from "../context/FileContext/FileContext"
import { Canvas } from "./Canvas"
import { CanvasContext } from "../context/CanvasContext/CanvasContext"
import { EyedropperMenu } from "./EyedropperMenu"

export const Main = () => {
  const { file, fileUrl } = useContext(FileContext)
  const { isEyedropper } = useContext(CanvasContext)


  if (!file || !fileUrl) {
    return <div className="text-center">
      Загрузите файл
    </div>
  }

 

  return (
    <main className="h-full flex">
      <Canvas />
      {isEyedropper && 
      <div>
        <EyedropperMenu />
      </div>}
    </main>
  )
}