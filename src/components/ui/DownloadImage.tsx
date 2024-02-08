import { downloadImage } from "@/lib/filters";
import { useCanvasContext } from "../context/CanvasContext/useCanvasContext";

export interface DownloadImageProps {
  className?: string
}

export const DownloadImage = () => {
  const canvasRef = useCanvasContext();

  const onDownload = () => {
    if (!canvasRef?.current) {
      return
    }

    downloadImage(canvasRef.current)
  }

  return (
    <div onClick={onDownload}>
      Скачать
    </div>
  )
}