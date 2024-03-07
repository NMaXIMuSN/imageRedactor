export interface WorkerResponse {
  type: 'finally' | 'loading',
  percentages: number,
  data: Uint8ClampedArray,
  newWidth: number,
  newHeight: number,
}

export interface WorkerRequest {
  newWidth: number,
  newHeight: number,
  oldWidth: number,
  oldHeight: number,
  ImageData: Uint8ClampedArray,
}

const bilinearWorker = () => {
  function bilinearInterpolation(x: number, y: number, ImageData: Uint8ClampedArray, width: number, height: number, shift = 0) {
    const x1 = x
    const x2 = Math.min(x + 1, width)
    const y1 = y
    const y2 = Math.min(y + 1, height)
  
    const f_x1y1 = (y1 * width + x1) * 4;
    const f_x1y2 = (y2 * width + x1) * 4;
    const f_x2y1 = (y1 * width + x2) * 4;
    const f_x2y2 = (y2 * width + x2) * 4;
  
    return (
      ImageData[f_x1y1 + shift] * (x2 - x) * (y2 - y) +
      ImageData[f_x2y1 + shift] * (x - x1) * (y2 - y) +
      ImageData[f_x1y2 + shift] * (x2 - x) * (y - y1) +
      ImageData[f_x2y2 + shift] * (x - x1) * (y - y1)
    )
  }

  onmessage = (e: MessageEvent<WorkerRequest>) => {
    const {newHeight, newWidth, ImageData, oldHeight, oldWidth} = e.data
    const newImageDataArray = new Uint8ClampedArray(newWidth * newHeight * 4);
    const scaleX = newWidth / oldWidth;
    const scaleY = newHeight / oldHeight;

    for (let y = 0; y < newHeight; y++) {
      for (let x = 0; x < newWidth; x++) {
        const srcX = Math.floor(x / scaleX);
        const srcY = Math.floor(y / scaleY);

        const dstIndex = (y * newWidth + x) * 4;

        newImageDataArray[dstIndex + 0] = bilinearInterpolation(srcX, srcY, ImageData, oldWidth, oldHeight, 0)
        newImageDataArray[dstIndex + 1] = bilinearInterpolation(srcX, srcY, ImageData, oldWidth, oldHeight, 1)
        newImageDataArray[dstIndex + 2] = bilinearInterpolation(srcX, srcY, ImageData, oldWidth, oldHeight, 2)
        newImageDataArray[dstIndex + 3] = bilinearInterpolation(srcX, srcY, ImageData, oldWidth, oldHeight, 3)

        if (x === newWidth - 1 && y % 100 === 0) {
          postMessage({
            type: 'loading',
            percentages: Math.ceil((y * x) / (newHeight * newWidth) * 100),
            data: newImageDataArray
          } as WorkerResponse)
        }
      }
    }

    postMessage({
      type: 'finally',
      percentages: 100,
      data: newImageDataArray,
      newHeight,
      newWidth,
    } as WorkerResponse)
  }
}

let code = bilinearWorker.toString()
code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"))
const blob = new Blob([code], { type: 'application/javascriptssky' })
const bilinearScript = URL.createObjectURL(blob)
export { bilinearScript }