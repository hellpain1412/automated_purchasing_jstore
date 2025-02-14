import { CommonEventName, PurchasingEventName } from "@/common/constant";

export interface ICommonActionAPI {
  getDirectoryPath: () => Promise<string>;
  getFilePath: () => Promise<string>;
  showWarningConfirmDialog: (...args: any) => Promise<any>;
}

export interface IPurchasingActionAPI {
  startProcess: (...args: any) => void;
  endProcess: () => any;
}

declare global {
  interface Window {
    [CommonEventName.EVENT_NAME]: ICommonActionAPI;
    [PurchasingEventName.EVENT_NAME]: IPurchasingActionAPI;
  }
}
