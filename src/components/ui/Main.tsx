import { useContext } from "react"
import { FileContext } from "../context/FileContext/FileContext"
import { Canvas } from "./Canvas"

export const Main = () => {
  const { file, fileUrl } = useContext(FileContext)

  if (!file || !fileUrl) {
    return <div className="text-center">
      Загрузите файл
    </div>
  }
  return (
    <main className="h-full">

      <Canvas />
    </main>
  )
}