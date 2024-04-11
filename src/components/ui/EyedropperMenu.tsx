import { contrast } from "@/lib/colorConversions"
import { useContext, useMemo, useState } from "react"
import { EyedropperContext, EyedropperItemSchema, } from "../context/EyedropperContext/EyedropperContext"
import { ShortCut } from "./ShortCut"
import { ColorSwatch } from "./ColorSwatch"
import { CanvasContext } from "../context/CanvasContext/CanvasContext"

interface SelectedColorSchema {
  first: EyedropperItemSchema | null,
  second?: EyedropperItemSchema | null,
}

export const EyedropperMenu = () => {
  const { setIsEyedropper } = useContext(CanvasContext)
  const { firstHistory, secondHistory } = useContext(EyedropperContext)
  const [ selectedColor, setSelectColor] = useState<SelectedColorSchema>({
    first: null,
    second: null,
  })

  const contrastData = useMemo(() => {
    const { first, second } = selectedColor
    if (!first || !second) {
      return 
    }
    console.log(1)
    return contrast(first.rbga, second.rbga)
  }, [selectedColor])


  return (
    <div className="w-[400px] py-2 px-4 overflow-x-scroll space-y-4">
      <div className="space-y-2">
        
        <div className="flex justify-between">
          <div>
            Первые цвета <ShortCut className='inline'>ЛКМ</ShortCut>
          </div>
          <div>
            <div className="-m-2 p-2 cursor-pointer" onClick={() => setIsEyedropper?.(false)}>
              X
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {firstHistory?.map((item) => (
            <ColorSwatch
              selected={item.id === selectedColor.first?.id}
              rgb={item.rbga}
              x={item.x}
              y={item.y}
              key={item.id}
              onClick={() => {setSelectColor(prev => ({
              ...prev,
              first: item
            }))}}/>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <div>
          Вторые цвета <ShortCut className='inline'>⌘ЛКМ</ShortCut>
        </div>
        <div className="flex flex-wrap gap-2">
          {secondHistory?.map((item) => (
            <ColorSwatch selected={item.id === selectedColor.second?.id} rgb={item.rbga} x={item.x} y={item.y}  key={item.id} onClick={() => {setSelectColor(prev => ({
              ...prev,
              second: item
            }))}}/>
          ))}
        </div>
      </div>
      {contrastData && <div className={`${parseFloat(contrastData.L1) >= 4.5 ? '' : 'text-red-400'}`}>
        Контрастность 1 цвета ко 2 цвету: <b>{contrastData.L1}:{contrastData.L2}</b>
      </div>}
    </div>
  )
}