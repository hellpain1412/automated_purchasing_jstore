import { BrowserWindow } from "electron";
import { CommonEvent, PurchasingEvent } from "./event";

export const initActions = (window: BrowserWindow) => {
  CommonEvent.getDirectoryPath(window);
  CommonEvent.getFilePath(window);
  CommonEvent.openLink(window);
  CommonEvent.showWarningConfirmDialog(window);
  CommonEvent.exportXlsx();
  // =====================================================================
  PurchasingEvent.startProcess();
};
