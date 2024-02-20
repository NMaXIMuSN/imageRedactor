import { useContext } from 'react'
import { Label } from './label'
import { CanvasContext } from '../context/CanvasContext/CanvasContext'
import { Checkbox } from './checkbox'

export const CheckboxVisibleDefaultCanvas = () => {
  const {isVisibleDefaultCanvas, setIsVisibleDefaultCanvas} = useContext(CanvasContext)
  
  return (
    <div className="cursor-pointer flex items-center space-x-2">
      <Checkbox id='isVisibleDefaultCanvas' checked={isVisibleDefaultCanvas} onCheckedChange={() => setIsVisibleDefaultCanvas?.(prev => !prev)} />
      <Label htmlFor="isVisibleDefaultCanvas" className='text-[16px]'>
        Сравнить
      </Label>
    </div>
  )
}