import { ReactNode } from "react"
import { CanvasContext, canvasRef } from "./CanvasContext"

export interface CanvasContextProviderProps {
  children: ReactNode
}

export const CanvasContextProvider = ({ children }: CanvasContextProviderProps) => {
  return <CanvasContext.Provider value={canvasRef}>
    { children }
  </CanvasContext.Provider>
}