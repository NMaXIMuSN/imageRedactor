import { useContext } from 'react'
import { CanvasContext } from '../context/CanvasContext/CanvasContext'
import { ImageDataContext } from '../context/ImageDataContext/ImageDataContext'

export const ResetImage = () => {
  const { canvasRef } = useContext(CanvasContext)
  const { img } = useContext(ImageDataContext)

  const onReset = () => {
    const context = canvasRef.current?.getContext('2d')

    if (!context) {
      return
    }

    context.drawImage(img, 0, 0)
  }
  return (
    <div className='cursor-pointer' onClick={onReset}>
      Отмена
    </div>
  )
}