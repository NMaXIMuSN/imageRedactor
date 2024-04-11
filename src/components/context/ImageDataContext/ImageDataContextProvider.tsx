import { ReactNode, useContext, useEffect, useState } from "react"
import { ImageDataContext, ImageDataContextSchema, img } from "./ImageDataContext"
import { FileContext } from "../FileContext/FileContext"

export interface ImageDataContextProviderProps {
  children?: ReactNode
}

export const ImageDataContextProvider= ({ children }: ImageDataContextProviderProps) => {
  const { fileUrl } = useContext(FileContext)
  const [ x, setX ] = useState(0)
  const [ y, setY ] = useState(0)
  const [ currentColor, setCurrentColor ] = useState<Uint8ClampedArray>(new Uint8ClampedArray())

  useEffect(() => {
    img.src = fileUrl || ''
  }, [fileUrl])

  const value: ImageDataContextSchema = {
    setX,
    setY,
    x,
    y,
    img,
    currentColor,
    setCurrentColor,
  }

  return (
    <ImageDataContext.Provider value={value}>
      {children}
    </ImageDataContext.Provider>
  )
}