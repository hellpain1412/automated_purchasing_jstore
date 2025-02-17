import { CommonEventName, PurchasingEventName } from "@/common/constant";

export interface ICommonActionAPI {
  getDirectoryPath: () => Promise<string>;
  getFilePath: () => Promise<string>;
  openLink: (href: string) => Promise<void>;
  showWarningConfirmDialog: (...args: any) => Promise<any>;
  exportXlsx: (data: any, filePath: string) => Promise<void>;
}

export interface IPurchasingActionAPI {
  startProcess: (...args: any) => void;
  endProcess: () => any;
  status: (callback: (arg: any) => void) => void;
  xlsxData: (callback: (arg: any) => void) => void;
  getProductList: (callback: (arg: any) => void) => void;
}

declare global {
  interface Window {
    [CommonEventName.EVENT_NAME]: ICommonActionAPI;
    [PurchasingEventName.EVENT_NAME]: IPurchasingActionAPI;
  }
}
