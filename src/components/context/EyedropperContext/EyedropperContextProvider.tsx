import { ReactNode, useState } from "react"
import { EyedropperContext, EyedropperContextSchema, EyedropperItemSchema } from "./EyedropperContext"

export interface EyedropperContextProviderProps {
  children: ReactNode
}

export const EyedropperContextProvider = ({ children }: EyedropperContextProviderProps) => {
  const [firstHistory, setFirstHistory] = useState<EyedropperItemSchema[]>([])
  const [secondHistory, setSecondHistory] = useState<EyedropperItemSchema[]>([])
  const value: EyedropperContextSchema = {
    firstHistory,
    secondHistory,
    setFirstHistory,
    setSecondHistory
  }

  return <EyedropperContext.Provider value={value}>
    { children }
  </EyedropperContext.Provider>
}