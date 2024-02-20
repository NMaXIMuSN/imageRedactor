import { Dispatch, SetStateAction, createContext } from "react";

export interface ImageDataContextSchema {
  x?: number,
  y?: number,
  setY?: Dispatch<SetStateAction<number>>,
  setX?: Dispatch<SetStateAction<number>>,
  img: HTMLImageElement
}

export const img = new Image()

export const ImageDataContext = createContext<ImageDataContextSchema>({
  img
})