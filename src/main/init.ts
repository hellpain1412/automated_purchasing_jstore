import { BrowserWindow } from "electron";
import { CommonEvent } from "./event";

export const initActions = (window: BrowserWindow) => {
  CommonEvent.getDirectoryPath(window);
  CommonEvent.getFilePath(window);
  CommonEvent.showWarningConfirmDialog(window);
};
