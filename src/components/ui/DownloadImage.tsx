import { downloadImage } from "@/lib/filters";
import { useCanvasContext } from "../context/CanvasContext/useCanvasContext";
import { useContext } from "react";
import { ImageDataContext } from "../context/ImageDataContext/ImageDataContext";

export interface DownloadImageProps {
  className?: string
}

export const DownloadImage = () => {
  const canvasRef = useCanvasContext();
  const { img } = useContext(ImageDataContext);

  const onDownload = () => {
    if (!canvasRef?.current) {
      return
    }

    downloadImage(img)
  }

  return (
    <div className="cursor-pointer" onClick={onDownload}>
      Скачать
    </div>
  )
}