import { createContext } from "react";

export interface ImageDataContextSchema {
  width?: number;
  height?: number;
  setWidth?: (e: number) => void;
  setHeight?: (e: number) => void;
  x?: number,
  y?: number,
  setY?: (e: number) => void,
  setX?: (e: number) => void,
}

export const ImageDataContext = createContext<ImageDataContextSchema>({})