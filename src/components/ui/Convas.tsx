import { MouseEvent, useContext, useEffect, useMemo, useRef } from 'react'
import { ImageDataContext } from '../context/ImageDataContext/ImageDataContext'

interface CanvasProps {
  fileUrl: string
}



export const Canvas = ({ fileUrl }: CanvasProps) => {
  const img = useMemo(() => new Image(), [])
  const canvasRef = useRef<HTMLCanvasElement>(null)
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

  return (
    <canvas ref={canvasRef} className="max-w-full" onMouseMove={handleOnMouseMove}/>
  )
}