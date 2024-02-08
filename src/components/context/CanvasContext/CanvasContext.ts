import { RefObject, createContext, createRef } from "react";


export const canvasRef = createRef<HTMLCanvasElement>();
export const CanvasContext = createContext<RefObject<HTMLCanvasElement>>(canvasRef)
