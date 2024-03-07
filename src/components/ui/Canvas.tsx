import { MouseEvent, useCallback, useContext, useEffect, useState } from 'react'
import { ImageDataContext } from '../context/ImageDataContext/ImageDataContext'
import { CanvasContext } from '../context/CanvasContext/CanvasContext'
import { DefaultOverlayImage } from './DefaultOverlayImage'


export const Canvas = () => {
  const { img, setX, setY } = useContext(ImageDataContext)
  const { canvasRef, isVisibleDefaultCanvas, scaleValue, setDefaultImageData } = useContext(CanvasContext);
  const [ offsetWidth, setOffsetWidth ] = useState(0)
  const [ isFixedDefault, setIsFixedDefault ] = useState(false)

  const updateImgCanvas = useCallback(() => {
    if (canvasRef.current) {
      const context = canvasRef.current?.getContext('2d')
      if (!context) {
        return
      }
      context.clearRect(0, 0, canvasRef.current.offsetWidth, canvasRef.current.offsetHeight)
      const [wightImg, heightImg] = [img.width * ((scaleValue || 100) / 100), img.height * ((scaleValue || 100) / 100)] 
      context.drawImage(img, canvasRef.current.offsetWidth / 2 - wightImg / 2, canvasRef.current.offsetHeight / 2 - heightImg / 2, img.width * ((scaleValue || 100) / 100), img.height * ((scaleValue || 100) / 100))
    }
  }, [canvasRef, img, scaleValue])

  const setSizeCopyWrapper = useCallback(() => {
    if (canvasRef.current) {
      setOffsetWidth(canvasRef.current.offsetWidth)
    }
  }, [canvasRef])

  const updateCanvasSize = useCallback(() => {
    if (canvasRef.current) {
      canvasRef.current.width = canvasRef.current.offsetWidth
      canvasRef.current.height = canvasRef.current.offsetHeight
    }
  }, [canvasRef])

  useEffect(() => {
    updateImgCanvas()
  }, [updateImgCanvas, scaleValue])


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

      updateCanvasSize()

      updateImgCanvas()
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

  return (
    <>
      <div className='relative w-full h-full'>
        <canvas ref={canvasRef} className="w-full h-full" onMouseMove={handleOnMouseMove} onDoubleClick={() => setIsFixedDefault(prev => !prev)} />
        
        {isVisibleDefaultCanvas && <DefaultOverlayImage isFixed={isFixedDefault} offsetWidth={offsetWidth} />}
      </div>
    </>
  )
}