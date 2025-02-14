import { CommonEventName } from "@/common/constant";

export interface ICommonActionAPI {
  getDirectoryPath: () => Promise<string>;
  getFilePath: () => Promise<string>;
  showWarningConfirmDialog: (...args: any) => Promise<any>;
}

declare global {
  interface Window {
    [CommonEventName.EVENT_NAME]: ICommonActionAPI;
  }
}
