import { useContext, useEffect, useMemo, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from './button'
import { ImageDataContext } from '../context/ImageDataContext/ImageDataContext'
import { Label } from './label'
import { Input } from './input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './select'

type TypeResize = 'pixels' | 'percentages'
type TypeAlgorithm = 'stepwise' | 'bilinear' | 'bicubic'

interface IFormValue {
  width: string;
  height: string;
}

const canvas = document.createElement('canvas')

export const DialogResize = () => {
  const { img } = useContext(ImageDataContext)
  // const { fileUrl } = useContext(FileContext)
  const [ isOpen, setIsOpen ] = useState<boolean>(false)

  const [ selectType, setSelectType ] = useState<TypeResize>('pixels')
  const [ selectAlgorithm, setSelectAlgorithm ] = useState<TypeAlgorithm>('stepwise')

  const [formValue, setFormValue] = useState<Record<TypeResize, IFormValue>>({
    pixels: {
      height: img.height.toString(),
      width: img.width.toString(),
    },
    percentages: {
      height: '100',
      width: '100'
    }
  })

  const updateCanvas = (width: number, height: number) => {
    canvas.width = width
    canvas.height = height
    canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height)
  }

  const getSizes = () => {
    const [ height, width ] = [ img.height, img.width ]

    if (selectType === 'pixels') {
      return {
        oldWidth: width,
        oldHeight: height,
        newWidth: +formValue.pixels.width,
        newHeight: +formValue.pixels.height,
      }
    }

    return {
      oldWidth: width,
      oldHeight: height,
      newWidth: Math.floor(width * parseInt(formValue.percentages.width) / 100),
      newHeight: Math.floor(height * parseInt(formValue.percentages.height) / 100),
    }
  }

  const updateImg = async (ImageData: ImageData, context: CanvasRenderingContext2D) => {
    const ImageBitmap = await createImageBitmap(ImageData)
    context.drawImage(ImageBitmap, 0, 0);

    canvas.toBlob(function (blob) {
      if (!blob) {
        return
      }

      img.src = URL.createObjectURL(blob);      
    });    
  }

  const stepwise = ({
    newWidth,
    newHeight,
    context,
  }: {
    newWidth: number,
    newHeight: number,
    context: CanvasRenderingContext2D,
  }) => {
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height).data;

    const newImageDataArray = new Uint8ClampedArray(newWidth * newHeight * 4)
    const xRatio = canvas.width / newWidth;
    const yRatio = canvas.height / newHeight;

    for (let y = 0; y < newHeight; y++) {
      for (let x = 0; x < newWidth; x++) {
        const srcX = Math.floor(x * xRatio);
        const srcY = Math.floor(y * yRatio);

        const dstIndex = (y * newWidth + x) * 4;
        const srcIndex = (srcY * canvas.width + srcX) * 4;

        newImageDataArray[dstIndex] = imageData[srcIndex];
        newImageDataArray[dstIndex+ 1] = imageData[srcIndex + 1];
        newImageDataArray[dstIndex+ 2] = imageData[srcIndex + 2];
        newImageDataArray[dstIndex+ 3] = imageData[srcIndex + 3];
      }
    }
    
    updateCanvas(newWidth, newHeight);
    return new ImageData(newImageDataArray, newWidth, newHeight);
  }

  const bilinearInterpolation = (x: number, y: number, ImageData: Uint8ClampedArray, shift = 0) => {
    const x1 = x
    const x2 = Math.min(x + 1, canvas.width)
    const y1 = y
    const y2 = Math.min(y + 1, canvas.height)

    const f_x1y1 = (y1 * canvas.width + x1) * 4;
    const f_x1y2 = (y2 * canvas.width + x1) * 4;
    const f_x2y1 = (y1 * canvas.width + x2) * 4;
    const f_x2y2 = (y2 * canvas.width + x2) * 4;

    return (
      ImageData[f_x1y1 + shift] * (x2 - x) * (y2 - y) +
      ImageData[f_x2y1 + shift] * (x - x1) * (y2 - y) +
      ImageData[f_x1y2 + shift] * (x2 - x) * (y - y1) +
      ImageData[f_x2y2 + shift] * (x - x1) * (y - y1)
    )
  }

  const bilinear = ({
    newWidth,
    newHeight,
    context,
  }: {
    newWidth: number,
    newHeight: number,
    context: CanvasRenderingContext2D,
  }) => {
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height).data;
    const newImageDataArray = new Uint8ClampedArray(newWidth * newHeight * 4)
    const scaleX = newWidth /canvas.width;
    const scaleY = newHeight / canvas.height;

    for (let y = 0; y < newHeight; y++) {
      console.log(y + ' / ' + newHeight)
      for (let x = 0; x < newWidth; x++) {
        const srcX = Math.floor(x / scaleX);
        const srcY = Math.floor(y / scaleY);

        const dstIndex = (y * newWidth + x) * 4;

        newImageDataArray[dstIndex + 0] = bilinearInterpolation(srcX, srcY, imageData, 0)
        newImageDataArray[dstIndex + 1] = bilinearInterpolation(srcX, srcY, imageData, 1)
        newImageDataArray[dstIndex + 2] = bilinearInterpolation(srcX, srcY, imageData, 2)
        newImageDataArray[dstIndex + 3] = bilinearInterpolation(srcX, srcY, imageData, 3)
      }
    }
    updateCanvas(newWidth, newHeight);
    return new ImageData(newImageDataArray, newWidth, newHeight);
  }

  useEffect(() => {
    setFormValue({
      pixels: {
        height: img.height.toString(),
        width: img.width.toString(),
      },
      percentages: {
        height: '100',
        width: '100'
      }
    })
  }, [img.height, img.width, isOpen])

  const handleOnOpenChange = (e: boolean) => {
    setIsOpen(e)
  }

  const onSubmit = () => {
    const {
      newHeight,
      newWidth,
      oldHeight,
      oldWidth,
    } = getSizes()
    
    updateCanvas(oldWidth, oldHeight)
    const context = canvas.getContext('2d')

    if (!context) {
      return
    }
    context.drawImage(img, 0, 0);

    switch (selectAlgorithm) {
      case 'bicubic':
        
        break;

      case 'bilinear':
        updateImg(
          bilinear({
            context,
            newHeight,
            newWidth,
          }), context)
        break;
    
      default:
        updateImg(
          stepwise({
          context,
          newHeight,
          newWidth,
        }), context)
        break;
    }


    setIsOpen(false)
  }

  const countPx = useMemo(() => {
    return img.width * img.height * 4
  }, [img.width,img.height, img])

  const newCountPx = useMemo(() => {
    if (selectType === 'pixels') {
      return parseInt(formValue.pixels.width) * parseInt(formValue.pixels.height) * 4
    }

    return img.width * parseInt(formValue.percentages.width) / 100 * img.height * parseInt(formValue.percentages.height) / 100 * 4
  }, [formValue.percentages.height, formValue.percentages.width, formValue.pixels.height, formValue.pixels.width, img.height, img.width, selectType])
  return (
    <Dialog open={isOpen} onOpenChange={handleOnOpenChange}>
      <DialogTrigger className="dark">
        Изменить размер
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
        <DialogTitle>
          Изменение размеров изображения
        </DialogTitle>
        <DialogDescription>
          <div>
            Изначальное кол-во пикселей: <b>{countPx}px</b>
          </div>
          <div>
            Новое кол-во пикселей: <b>{newCountPx}px</b>
          </div>
        </DialogDescription>
        </DialogHeader>
        <div>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-5 items-center gap-4">
              <Label htmlFor="wight" className="text-left">
                Тип:
              </Label>
              <Select value={selectType} onValueChange={(e: TypeResize) => setSelectType(e)}>
                <SelectTrigger className="col-span-4">
                  <SelectValue placeholder="Select a fruit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Выберите тип</SelectLabel>
                    <SelectItem value="pixels">Пиксели</SelectItem>
                    <SelectItem value="percentages">Проценты</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-5 items-center gap-4">
              <Label htmlFor="wight" className="text-left">
                Ширина({selectType === 'pixels' ? 'px': '%'}):
              </Label>
              <Input
                id="wight"
                className="col-span-4"
                value={formValue[selectType].width}
                onChange={(e) => {
                  setFormValue((prev) => {
                    const newValue = {...prev}
                    newValue[selectType].width = e.target.value;
                    return newValue
                  })
                }}
              />
            </div>
            <div className="grid grid-cols-5 items-center gap-4">
              <Label htmlFor="height" className="text-left">
                Высота({selectType === 'pixels' ? 'px': '%'}):
              </Label>
              <Input
                id="height"
                className="col-span-4"
                value={formValue[selectType].height}
                onChange={(e) => {
                  setFormValue((prev) => {
                    const newValue = {...prev}
                    newValue[selectType].height = e.target.value;
                    return newValue
                  })
                }}
              />
            </div>
            <div className="grid grid-cols-5 items-center gap-4">
              <Label htmlFor="wight" className="text-left">
                Алгоритм:
              </Label>
              <Select value={selectAlgorithm} onValueChange={(e: TypeAlgorithm) => setSelectAlgorithm(e)}>
                <SelectTrigger className="col-span-4">
                  <SelectValue placeholder="Select a fruit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Выберите алгоритм</SelectLabel>
                    <SelectItem value="stepwise">Интерполяция по ближайшему соседу</SelectItem>
                    <SelectItem value="bilinear">Билинейная интерполяция</SelectItem>
                    <SelectItem value="bicubic">Бикубическая интерполяция</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

          </div>
        </div>
        <DialogFooter>
          <Button onClick={onSubmit} type="submit">Подтвердить</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}