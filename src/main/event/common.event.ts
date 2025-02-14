import { CommonEventName } from "@/common/constant/event";
import { BrowserWindow, dialog, ipcMain } from "electron";

export class CommonEvent {
  static getDirectoryPath(window: BrowserWindow) {
    ipcMain.handle(CommonEventName.GET_DIRECTORY_PATH, async () => {
      const { canceled, filePaths } = await dialog.showOpenDialog(window, {
        properties: ["openDirectory", "createDirectory"],
      });
      return canceled ? "" : filePaths[0];
    });
  }

  static getFilePath(window: BrowserWindow) {
    ipcMain.handle(CommonEventName.GET_FILE_PATH, async () => {
      const { canceled, filePaths } = await dialog.showOpenDialog(window, {
        properties: ["openFile"],
      });
      return canceled ? "" : filePaths[0];
    });
  }

  static showWarningConfirmDialog(window: BrowserWindow) {
    ipcMain.handle(
      CommonEventName.OPEN_WARNING_DIALOG,
      async (event, options) => {
        const { response } = await dialog.showMessageBox(null, options);
        return !response;
      }
    );
  }
}
