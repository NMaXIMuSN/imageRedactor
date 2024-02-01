import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "./button"
import { Label } from "./label"
import { Input } from "./input"
import { useContext, useRef, useState } from "react"
import { FileContext } from "../context/FileContext/FileContext"
import { axiosInstance } from "@/lib/axios"


export const DialogLoadImg = () => {
  const { setFile: setFileContext } = useContext(FileContext)

  const [ fileUrl, setFileUrl ] = useState<string>('')
  const [ isOpen, setIsOpen ] = useState<boolean>(false)

  const inputFileRef = useRef<HTMLInputElement>(null)

  const onSubmit = async () => {
    
    if (inputFileRef.current?.files?.[0]) {
      setFileContext?.(inputFileRef.current.files[0])
      onClose()
      return
    }
    
    if (fileUrl) {
      await axiosInstance({
        method: 'GET',
        url: fileUrl,
      })
        .then((res): void => {
          if (/image\/*/gi.test(res.headers["content-type"])) {
            const file = new File([res.data], "name", {
              type: res.headers["content-type"]
            });
            setFileContext?.(file)
            onClose()
          }
        })
    }
  }

  const onClose = () => {
    if (inputFileRef.current?.files) {
      inputFileRef.current.files = null
    }
    setFileUrl('')
    setIsOpen(false)
  }

  const handleOnOpenChange = (e: boolean) => {
    if (!e) {
      setFileUrl('')
    }

    setIsOpen(e)
  }
  return (
    <Dialog open={isOpen} onOpenChange={handleOnOpenChange}>
      <DialogTrigger className="dark">
        Файл
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
        <DialogTitle>
          Загрузка изображения
        </DialogTitle>
        <DialogDescription>
          Либо загрузите файл, либо введите ссылку на файл.
        </DialogDescription>
        </DialogHeader>
        <div>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="file" className="text-right">
                Файл
              </Label>
              <Input
                id="file"
                type="file"
                accept="image/*"
                className="col-span-3"
                ref={inputFileRef}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="url" className="text-right">
                Ссылка
              </Label>
              <Input
                id="url"
                className="col-span-3"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
              />
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