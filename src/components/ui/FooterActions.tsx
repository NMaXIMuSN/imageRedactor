import cls from 'classnames'
import { useContext } from 'react'
import { CanvasContext } from '../context/CanvasContext/CanvasContext'
import { DnDIcon } from './DnDIcon'
import { EyedropperIcon } from './EyedropperIcon'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip'
import { useHotkeys } from '@/hooks/useHotkeys'
import { ShortCut } from './ShortCut'
interface FooterActionsProps {
  className?: string
}

export const FooterActions = ({ className }: FooterActionsProps) => {
  const { isMoveable, setIsMovable, isEyedropper, setIsEyedropper } = useContext(CanvasContext)
  useHotkeys('m', 'meta', (e) => {
    e.preventDefault()
    setIsMovable?.(prev => !prev)
  })

  useHotkeys('p', 'meta', (e) => {
    e.preventDefault()
    setIsEyedropper?.(prev => !prev)
  })

  return (
    <div className={cls("flex gap-2", [className])}>
      <TooltipProvider>
        <Tooltip delayDuration={100}>
          <TooltipTrigger>
            <div
              className={cls('p-[2px] border hover:border-gray-700 cursor-pointer', {
                'bg-gray-700': isMoveable,
                'border-transparent': !isMoveable,
              })}
              onClick={() => {setIsMovable?.(prev => !prev)}}
            >
              <DnDIcon  width={20} height={20}/>
            </div>
          </TooltipTrigger>
          <TooltipContent >
            <div>Позволяет изменять положение изображения <ShortCut className='inline'>⌘M</ShortCut></div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip delayDuration={100}>
          <TooltipTrigger>
            <div
              className={cls('p-[2px] border hover:border-gray-700 cursor-pointer', {
                'bg-gray-700': isEyedropper,
                'border-transparent': !isEyedropper,
              })}
              onClick={() => {setIsEyedropper?.(prev => !prev)}}
            >
              <EyedropperIcon width={20} height={20}/>
            </div>
          </TooltipTrigger>
          <TooltipContent >
            <div>Позволяет посмотреть цвет определенного пикселя <ShortCut className='inline'>⌘P</ShortCut></div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}