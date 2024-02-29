import { ReactNode, useState } from "react"
import { CanvasContext, CanvasContextSchema, canvasRef } from "./CanvasContext"

export interface CanvasContextProviderProps {
  children: ReactNode
}

export const CanvasContextProvider = ({ children }: CanvasContextProviderProps) => {
  const [isVisibleDefaultCanvas, setIsVisibleDefaultCanvas] = useState(false)
  const [defaultImageData, setDefaultImageData] = useState<ImageData>()
  const [scaleValue, setScaleValue] = useState<number>(100)

  const value: CanvasContextSchema = {
    canvasRef, 
    isVisibleDefaultCanvas,
    setIsVisibleDefaultCanvas,
    defaultImageData,
    setDefaultImageData,
    scaleValue,
    setScaleValue,
  }
  return <CanvasContext.Provider value={value}>
    { children }
  </CanvasContext.Provider>
}