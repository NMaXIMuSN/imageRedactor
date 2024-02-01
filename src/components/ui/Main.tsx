import { useContext } from "react"
import { FileContext } from "../context/FileContext/FileContext"
import { Canvas } from "./Convas"

export const Main = () => {
  const { file, fileUrl } = useContext(FileContext)

  if (!file) {
    return <div>
      Загрузите файл
    </div>
  }
  return (
    <main>
      {fileUrl && <Canvas fileUrl={fileUrl} />}
    </main>
  )
}