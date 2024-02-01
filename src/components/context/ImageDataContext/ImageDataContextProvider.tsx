import { ReactNode, useState } from "react"
import { ImageDataContext, ImageDataContextSchema } from "./ImageDataContext"

export interface ImageDataContextProviderProps {
  children?: ReactNode
}

export const ImageDataContextProvider= ({ children }: ImageDataContextProviderProps) => {
  const [ height, setHeight ] = useState(0)
  const [ width, setWidth ] = useState(0)
  const [ x, setX ] = useState(0)
  const [ y, setY ] = useState(0)
  const value: ImageDataContextSchema = {
    width,
    height,
    setWidth,
    setHeight,
    setX,
    setY,
    x,
    y
  }

  return (
    <ImageDataContext.Provider value={value}>
      {children}
    </ImageDataContext.Provider>
  )
}