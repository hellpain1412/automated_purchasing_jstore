import { CommonEventName } from "@/common/constant/event.constant";
import { BrowserWindow, dialog, ipcMain, shell } from "electron";
import { XlsxHandlerService } from "../service";

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
    ipcMain.on(CommonEventName.EXPORT_XLSX, async (event, data, filePath) => {
      const JSON_Data = data.map((item: any, index: number) => ({
        STT: index + 1,
        PRODUCT_ID: item?.productId || "",
        NAME: item?.name || "",
        URL: item?.url || "",
        PRICE: item?.price || "",
        STATUS: item?.status || "",
      }));
      XlsxHandlerService.exportXLSX(JSON_Data, filePath);
    });
  }
}
