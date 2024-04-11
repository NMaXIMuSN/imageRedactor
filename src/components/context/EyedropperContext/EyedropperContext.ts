import { Dispatch, SetStateAction, createContext } from "react";

export interface EyedropperItemSchema {
  id: number
  rbga: number[],
  x: number,
  y: number
}

export interface EyedropperContextSchema {
  firstHistory?: EyedropperItemSchema[]
  secondHistory?: EyedropperItemSchema[]
  setFirstHistory?: Dispatch<SetStateAction<EyedropperItemSchema[]>>
  setSecondHistory?: Dispatch<SetStateAction<EyedropperItemSchema[]>>
}

export const EyedropperContext = createContext<EyedropperContextSchema>({})
