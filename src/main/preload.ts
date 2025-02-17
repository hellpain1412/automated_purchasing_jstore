// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { CommonEventName, PurchasingEventName } from "@/common/constant";
import { contextBridge, ipcRenderer, OpenDialogOptions } from "electron";

contextBridge.exposeInMainWorld(CommonEventName.EVENT_NAME, {
  getDirectoryPath: () =>
    ipcRenderer.invoke(CommonEventName.GET_DIRECTORY_PATH),

  getFilePath: () => ipcRenderer.invoke(CommonEventName.GET_FILE_PATH),

  openLink: (...args: any) =>
    ipcRenderer.send(CommonEventName.OPEN_LINK, ...args),

  openWarningConfirmDialog: (options: OpenDialogOptions) =>
    ipcRenderer.invoke(CommonEventName.OPEN_WARNING_DIALOG, options),

  exportXlsx: (data: any, filePath: string) =>
    ipcRenderer.send(CommonEventName.EXPORT_XLSX, data, filePath),
});

contextBridge.exposeInMainWorld(PurchasingEventName.EVENT_NAME, {
  startProcess: (...args: any) =>
    ipcRenderer.send(PurchasingEventName.START_PROCESS, ...args),

  stopProcess: (...args: any) =>
    ipcRenderer.send(PurchasingEventName.STOP_PROCESS),

  endProcess: (callback: (arg: any) => void) =>
    ipcRenderer.on(PurchasingEventName.END_PROCESS, (event, arg) => {
      ipcRenderer.removeAllListeners();
      return callback(arg);
    }),
  status: (callback: (arg: any) => void) =>
    ipcRenderer.on(PurchasingEventName.STATUS, (event, arg) => callback(arg)),

  xlsxData: (callback: (arg: any) => void) =>
    ipcRenderer.once(PurchasingEventName.XLSX_DATA, (event, arg) =>
      callback(arg)
    ),
  getProductList: (callback: (arg: any) => void) =>
    ipcRenderer.on(PurchasingEventName.GET_PRODUCT_LIST, (event, arg) =>
      callback(arg)
    ),
});
