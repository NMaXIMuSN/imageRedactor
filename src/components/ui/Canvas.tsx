import { MouseEvent, useCallback, useContext, useEffect, useState } from 'react'
import { ImageDataContext } from '../context/ImageDataContext/ImageDataContext'
import { Button } from './button'
import { acceptFiler, blackAndWhite, invert } from '@/lib/filters'
import { CanvasContext } from '../context/CanvasContext/CanvasContext'
import { DefaultOverlayImage } from './DefaultOverlayImage'


export const Canvas = () => {
  const { img, setX, setY } = useContext(ImageDataContext)
  const { canvasRef, isVisibleDefaultCanvas, setDefaultImageData } = useContext(CanvasContext);
  const [ offsetWidth, setOffsetWidth ] = useState(0)
  const [ isFixedDefault, setIsFixedDefault ] = useState(false)

  const setSizeCopyWrapper = useCallback(() => {
    if (canvasRef.current) {
      setOffsetWidth(canvasRef.current.offsetWidth)
    }
  }, [canvasRef])


  useEffect(() => {
    window.addEventListener("resize", setSizeCopyWrapper)
    return () => {
      window.removeEventListener("resize", setSizeCopyWrapper)
    }
  }, [setSizeCopyWrapper])


  img.onload = () => {
    if (canvasRef.current) {
      const context = canvasRef.current?.getContext('2d')
      if (!context) {
        return
      }

      canvasRef.current.width = img.width
      canvasRef.current.height = img.height
      context.drawImage(img, 0, 0)
      setDefaultImageData?.(context.getImageData(0, 0, img.width, img.height))
      
      setSizeCopyWrapper()
    }
  }
 
  useEffect(() => {
    setIsFixedDefault(!isVisibleDefaultCanvas)
  }, [isVisibleDefaultCanvas])

  const handleOnMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    const {x, y, width, height} = e.currentTarget.getBoundingClientRect()
    
    const kX = img.width / width
    const kY = img.height / height
    
    const newX = Math.ceil((e.clientX - x) * kX)
    const newY = Math.ceil((e.clientY - y) * kY)

    setX?.(newX)
    setY?.(newY)
  }
  
  const invertColors = () => {
    if (canvasRef.current) {
      acceptFiler(canvasRef.current, invert)
    }
  }
  const blackAndWhiteColors = () => {
    if (canvasRef.current) {
      acceptFiler(canvasRef.current, blackAndWhite)
    }
  }

  return (
    <>
      <Button onClick={invertColors}>
        инвертировать цвета
      </Button>
      <Button onClick={blackAndWhiteColors}>
        черно белый фильтр
      </Button>
      <div className='relative w-fit'>
        <canvas ref={canvasRef} className="max-w-full" onMouseMove={handleOnMouseMove} onDoubleClick={() => setIsFixedDefault(prev => !prev)} />
        
        {isVisibleDefaultCanvas && <DefaultOverlayImage isFixed={isFixedDefault} offsetWidth={offsetWidth} />}
      </div>
    </>
  )
}