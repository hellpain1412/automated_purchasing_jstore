import { BrowserWindow } from "electron";
import { CommonEvent, PurchasingEvent } from "./event";

export const initActions = (window: BrowserWindow) => {
  CommonEvent.getDirectoryPath(window);
  CommonEvent.getFilePath(window);
  CommonEvent.showWarningConfirmDialog(window);
  // =====================================================================
  PurchasingEvent.startProcess();
};
