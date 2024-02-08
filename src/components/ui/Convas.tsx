import { MouseEvent, useContext, useEffect, useMemo } from 'react'
import { ImageDataContext } from '../context/ImageDataContext/ImageDataContext'
import { Button } from './button'
import { acceptFiler, blackAndWhite, invert } from '@/lib/filters'
import { CanvasContext } from '../context/CanvasContext/CanvasContext'

interface CanvasProps {
  fileUrl: string
}



export const Canvas = ({ fileUrl }: CanvasProps) => {
  const img = useMemo(() => new Image(), [])
  const canvasRef = useContext(CanvasContext);

  const { setHeight, setWidth, setX, setY} = useContext(ImageDataContext)

  img.onload = () => {
    if (canvasRef.current) {
      const context = canvasRef.current?.getContext('2d')
      canvasRef.current.width = img.width
      canvasRef.current.height = img.height
      setWidth?.(img.width)
      setHeight?.(img.height)
      context?.drawImage(img, 0, 0)
    }
  }

  useEffect(() => {
    img.src = fileUrl
  }, [fileUrl, img])

  const handleOnMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    const {x, y, width, height} = e.currentTarget.getBoundingClientRect()
    const kX = img.width / width
    const kY = img.height / height
    setX?.(Math.ceil((e.clientX - x) * kX))
    setY?.(Math.ceil((e.clientY - y) * kY))
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

  const onReset = () => {
    if (!canvasRef.current) {
      return
    }

    const context = canvasRef.current?.getContext('2d')
    context?.drawImage(img, 0, 0)
  }

  return (
    <>
      <Button onClick={invertColors}>
        инвертировать цвета
      </Button>
      <Button onClick={blackAndWhiteColors}>
        черно белый фильтр
      </Button>
      <Button onClick={onReset}>
        отмена
      </Button>
      <canvas ref={canvasRef} className="max-w-full" onMouseMove={handleOnMouseMove}/>
    </>
  )
}