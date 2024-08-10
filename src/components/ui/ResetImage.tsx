import { useContext } from 'react'
import { ImageDataContext } from '../context/ImageDataContext/ImageDataContext'
import { FileContext } from '../context/FileContext/FileContext'

export const ResetImage = () => {
  const { img } = useContext(ImageDataContext)
  const { fileUrl } = useContext(FileContext)
  
  const onReset = () => {
    img.src = fileUrl || ''
  }
  return (
    <div className='cursor-pointer' onClick={onReset}>
      Отмена
    </div>
  )
}