import { CommonEventName } from "@/common/constant/event.constant";
import { BrowserWindow, dialog, ipcMain, shell } from "electron";

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

  static openLink(window: BrowserWindow) {
    ipcMain.on(CommonEventName.OPEN_LINK, async (event, href: string) => {
      event.preventDefault();
      shell.openExternal(href);
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

  static exportXlsx() {
    ipcMain.on(CommonEventName.EXPORT_XLSX, async (event, data) => {
      console.log(123, data);

      return data;
    });
  }
}
