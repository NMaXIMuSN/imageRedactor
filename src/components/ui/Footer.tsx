import { useContext } from "react"
import { FileContext } from "../context/FileContext/FileContext"
import { ImageDataContext } from "../context/ImageDataContext/ImageDataContext"

export const Footer = () => {
  const { file } = useContext(FileContext)
  const { width, height, x, y } = useContext(ImageDataContext)
  if (!file) {
    return
  }
  return (
    <footer className="py-3 mt-4 border-t border-t-white border-opacity-25">
      <div className="container">
        <div className="flex gap-4">
          <div>
            Ширина: <b>{width}</b>
          </div>
          <div>
            Высота: <b>{height}</b>
          </div>
          <div>
            X: <b>{x}</b>
          </div>
          <div>
            Y: <b>{y}</b>
          </div>
        </div>
      </div>
    </footer>
  )
}