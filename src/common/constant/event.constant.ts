export class CommonEventName {
  static EVENT_NAME = "commonActionAPI";
  static GET_DIRECTORY_PATH = `${CommonEventName.EVENT_NAME}:getDirectoryPath`;
  static GET_FILE_PATH = `${CommonEventName.EVENT_NAME}:getFilePath`;
  static OPEN_LINK = `${CommonEventName.EVENT_NAME}:openLink`;
  static OPEN_WARNING_DIALOG = `${CommonEventName.EVENT_NAME}:openWarningDialog`;
  static EXPORT_XLSX = `${CommonEventName.EVENT_NAME}:exportXlsx`;
}

export class PurchasingEventName {
  static EVENT_NAME = "purchasingActionAPI";
  static START_PROCESS = `${PurchasingEventName.EVENT_NAME}:startProcess`;
  static STOP_PROCESS = `${PurchasingEventName.EVENT_NAME}:stopProcess`;
  static END_PROCESS = `${PurchasingEventName.EVENT_NAME}:endProcess`;
  static STATUS = `${PurchasingEventName.EVENT_NAME}:status`;
  static XLSX_DATA = `${PurchasingEventName.EVENT_NAME}:xlsxData`;
  static GET_PRODUCT_LIST = `${PurchasingEventName.EVENT_NAME}:getProductList`;
}
