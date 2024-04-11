import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
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
import { IsLockIcon } from './IsLockIcon'
import { IsNoLockIcon } from './IsNoLockIcon'
import { WorkerRequest, WorkerResponse, bilinearScript } from '@/lib/workers/bilinearWorker'
import { stepwiseScript } from '@/lib/workers/stepwiseWorker'
import { Progress } from './progress'

type TypeResize = 'pixels' | 'percentages'
type TypeAlgorithm = 'stepwise' | 'bilinear' | 'bicubic'

interface IFormValue {
  width: string;
  height: string;
}

const canvas = document.createElement('canvas')

export const DialogResize = () => {
  const { img } = useContext(ImageDataContext)
  const [ isLock, setIsLock ] = useState(false)
  const [ isOpen, setIsOpen ] = useState<boolean>(false)
  const [ isLoading, setIsLoading ] = useState(false)
  const [ percentages, setPercentages ] = useState(0)
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

  const bilinearWorker: Worker = useMemo(
    () => new Worker(bilinearScript),
    []
  );

  const stepwiseWorker: Worker = useMemo(
    () => new Worker(stepwiseScript),
    []
  );

  const updateCanvas = (width: number = canvas.width, height: number = canvas.height) => {
    canvas.width = width
    canvas.height = height
    canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height)
  }

  const getSizes = () => {
    return {
      oldWidth: img.width,
      oldHeight: img.height,
      newWidth: selectType === 'pixels' ? +formValue.pixels.width : Math.floor(img.width * parseInt(formValue.percentages.width) / 100),
      newHeight: selectType === 'pixels' ? +formValue.pixels.height : Math.floor(img.height * parseInt(formValue.percentages.height) / 100),
    }
  }

  const updateImg = useCallback(async (ImageData: ImageData) => {
    const context = canvas.getContext('2d')

    if (!context) {
      return
    }

    const ImageBitmap = await createImageBitmap(ImageData)
    context.drawImage(ImageBitmap, 0, 0);

    canvas.toBlob(function (blob) {
      if (!blob) {
        return
      }

      img.src = URL.createObjectURL(blob);      
    });    
  }, [img])

  useEffect(() => {
    if (window.Worker) {
      const onMessage = async (e: MessageEvent<WorkerResponse>) => {
        const { data } = e

        if (data.type === 'loading') {
          setPercentages(data.percentages)
        }

        if (data.type === 'finally') {
          const imageData = new ImageData(data.data, data.newWidth, data.newHeight);

          updateCanvas(data.newWidth, data.newHeight);

          await updateImg(imageData)
          setIsLoading(false)
          setIsOpen(false)
        }
      }

      bilinearWorker.onmessage = onMessage
      stepwiseWorker.onmessage = onMessage
    }
  }, [bilinearWorker, stepwiseWorker, updateImg])  
  
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
    setIsLoading(true)
    const sizeData = getSizes()

    updateCanvas(sizeData.oldWidth, sizeData.oldHeight)
    const context = canvas.getContext('2d')

    if (!context) {
      return
    }
    context.drawImage(img, 0, 0);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height).data;

    const workerData = {
      ImageData: imageData,
      ...sizeData
    } as WorkerRequest

    switch (selectAlgorithm) {
      case 'bilinear':
        bilinearWorker.postMessage(workerData)
        break;
    
      default:
        stepwiseWorker.postMessage(workerData)
        break;
    }
  }

  const newCountPx = useMemo(() => {
    if (selectType === 'pixels') {
      return Math.ceil(parseInt(formValue.pixels.width) * parseInt(formValue.pixels.height) * 4)
    }

    return img.width * Math.ceil(parseInt(formValue.percentages.width) / 100) * img.height * Math.ceil(parseInt(formValue.percentages.height) / 100) * 4
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
            Изначальное кол-во пикселей: <b>{img.width * img.height * 4}px</b>
        </DialogDescription>
        <DialogDescription>
          Новое кол-во пикселей: <b>{newCountPx}px</b>
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
                className="col-span-3"
                value={formValue[selectType].width}
                onChange={(e) => {
                  setFormValue((prev) => {
                    const newValue = {...prev}
                    newValue[selectType].width = e.target.value;
                    if (isLock) {
                      if (selectType === 'percentages') {
                        newValue[selectType].height = newValue[selectType].width;
                      } else {
                        const scale = img.width / img.height;
                        newValue[selectType].height = Math.floor((parseInt(newValue[selectType].width) / scale) || 0).toString()
                      }
                    }
                    return newValue
                  })
                }}
              />

              <div className='flex cursor-pointer justify-center mb-[-50px]' onClick={() => setIsLock((prev) => !prev)}>
                { isLock ? <IsLockIcon className='w-[50px] h-[50px]' /> : <IsNoLockIcon className='w-[50px] h-[50px]' />}
              </div>
            </div>

            <div className="grid grid-cols-5 items-center gap-4">
              <Label htmlFor="height" className="text-left">
                Высота({selectType === 'pixels' ? 'px': '%'}):
              </Label>
              <Input
                id="height"
                className="col-span-3"
                value={formValue[selectType].height}
                onChange={(e) => {
                  setFormValue((prev) => {
                    const newValue = {...prev}
                    newValue[selectType].height = e.target.value;
                    if (isLock) {
                      if (selectType === 'percentages') {
                        newValue[selectType].width = newValue[selectType].height;
                      } else {
                        const scale = img.height / img.width;
                        newValue[selectType].width = Math.floor(parseInt(newValue[selectType].height) / scale).toString()
                      }
                    }
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
          { isLoading && <Progress value={percentages} /> }

          { !isLoading && <Button onClick={onSubmit} type="submit">Подтвердить</Button> }
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}