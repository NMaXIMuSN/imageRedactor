import { ReactNode, useState } from "react"
import { CanvasContext, CanvasContextSchema, canvasRef } from "./CanvasContext"

export interface CanvasContextProviderProps {
  children: ReactNode
}

export const CanvasContextProvider = ({ children }: CanvasContextProviderProps) => {
  const [isVisibleDefaultCanvas, setIsVisibleDefaultCanvas] = useState(false)
  const [defaultImageData, setDefaultImageData] = useState<ImageData>()

  const value: CanvasContextSchema = {
    canvasRef, 
    isVisibleDefaultCanvas,
    setIsVisibleDefaultCanvas,
    defaultImageData,
    setDefaultImageData,
  }
  return <CanvasContext.Provider value={value}>
    { children }
  </CanvasContext.Provider>
}