// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { CommonEventName } from "@/common/constant";
import { contextBridge, ipcRenderer, OpenDialogOptions } from "electron";

contextBridge.exposeInMainWorld(CommonEventName.EVENT_NAME, {
  getDirectoryPath: () =>
    ipcRenderer.invoke(CommonEventName.GET_DIRECTORY_PATH),
  getFilePath: () => ipcRenderer.invoke(CommonEventName.GET_FILE_PATH),
  openWarningConfirmDialog: (options: OpenDialogOptions) =>
    ipcRenderer.invoke(CommonEventName.OPEN_WARNING_DIALOG, options),
});
