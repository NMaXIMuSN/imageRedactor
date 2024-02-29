import { DialogLoadImg } from "./DialogLoadImg"
import { DownloadImage } from "./DownloadImage"
import { ResetImage } from "./ResetImage"
import { Separator } from "./separator"
import { CheckboxVisibleDefaultCanvas } from "./CheckboxVisibleDefaultCanvas"
import { DialogResize } from "./DialogResize"

export const Header = () => {
  return (
    <header className="flex gap-4 py-3 border-b border-b-white border-opacity-25">
      <div className="container">
        <div className="flex h-6 space-x-4 items-center">
          <DialogLoadImg />
          <Separator orientation='vertical' className="bg-white bg-opacity-25" />
          <DownloadImage />
          <Separator orientation='vertical' className="bg-white bg-opacity-25" />
          <ResetImage />
          <Separator orientation='vertical' className="bg-white bg-opacity-25" />
          <CheckboxVisibleDefaultCanvas />
          <Separator orientation='vertical' className="bg-white bg-opacity-25" />
          <DialogResize />
          <Separator orientation='vertical' className="bg-white bg-opacity-25" />
        </div>
      </div>
    </header>
  )
}