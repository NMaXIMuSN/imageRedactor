import { useContext, useRef, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './dialog'
import { Button } from './button'
import { ImageDataContext } from '../context/ImageDataContext/ImageDataContext'

export const  DialogHistogram = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [imgData, setImgData] = useState<HTMLImageElement>()

  const { img } = useContext(ImageDataContext);

  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleOnOpenChange = (e: boolean) => {
    if (e) {
      setImgData(img)
    }

    setIsOpen(e)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOnOpenChange}>
      <DialogTrigger className="dark">
        Гистограмма
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
        <DialogTitle>
          Гистограмма
        </DialogTitle>
        <DialogDescription>
          Либо загрузите файл, либо введите ссылку на файл.
        </DialogDescription>
        </DialogHeader>
        <div>
          <canvas ref={canvasRef}/>
        </div>
        <DialogFooter>
          <Button type="submit">Подтвердить</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
