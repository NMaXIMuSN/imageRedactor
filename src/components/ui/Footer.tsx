import { useContext, useMemo } from "react"
import { FileContext } from "../context/FileContext/FileContext"
import { ImageDataContext } from "../context/ImageDataContext/ImageDataContext"
import { CanvasContext } from "../context/CanvasContext/CanvasContext"
import { Slider } from "@/components/ui/slider"
import { FooterActions } from "./FooterActions"

export const Footer = () => {
  const { file } = useContext(FileContext)
  const { img, x, y, currentColor } = useContext(ImageDataContext)
  const { canvasRef, scaleValue, setScaleValue } = useContext(CanvasContext)

  const rgb = useMemo(() => {
    const context = canvasRef.current?.getContext('2d')

    if (!context || !x || !y) {
      return
    }

    const pixel = context.getImageData(x, y, 1, 1)      
    return pixel.data
  }, [canvasRef, x, y])

  if (!file) {
    return
  }

  return (
    <footer className="py-3 mt-4 border-t border-t-white border-opacity-25">
      <div className="container">
        <div className="flex justify-between">
          <div className="flex gap-4">
            <div>
              Ширина: <b>{img.width}</b>
            </div>
            <div>
              Высота: <b>{img.height}</b>
            </div>
            <div>
              X: <b>{x}</b>
            </div>
            <div>
              Y: <b>{y}</b>
            </div>
            {rgb &&
              <div className="flex items-center">
                rgb: <span className="flex items-center gap-2">
                  <b>{currentColor?.toString()}</b>
                  <div className='size-4' style={{
                    backgroundColor: `rgba(${currentColor?.toString()})`,
                  }}/>
                </span>
              </div>
            }
            <div className="flex gap-2">
              <div>
                12%
              </div>
              <Slider className="w-[300px]" defaultValue={[(scaleValue || 100)]} max={300} min={12} onValueChange={(e) => setScaleValue?.(e[0])}/>
              <div>
                300%
              </div>
              <div>
                Значение: <b>{scaleValue}%</b>
              </div>
            </div>
          </div>
          <FooterActions />
        </div>
      </div>

    </footer>
  )
}