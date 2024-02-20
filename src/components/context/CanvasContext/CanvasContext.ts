import { Dispatch, RefObject, SetStateAction, createContext, createRef } from "react";

export interface CanvasContextSchema {
  canvasRef: RefObject<HTMLCanvasElement>
  defaultImageData?: ImageData,
  isVisibleDefaultCanvas: boolean,
  setIsVisibleDefaultCanvas?: Dispatch<SetStateAction<boolean>>
  setDefaultImageData?: Dispatch<SetStateAction<ImageData | undefined>>
}

export const canvasRef = createRef<HTMLCanvasElement>();
export const defaultCanvasRef = createRef<HTMLCanvasElement>();
export const CanvasContext = createContext<CanvasContextSchema>({
  canvasRef: canvasRef,
  isVisibleDefaultCanvas: false,
})
