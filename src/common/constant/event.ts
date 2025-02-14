export class CommonEventName {
  static EVENT_NAME = "commonActionAPI";
  static GET_DIRECTORY_PATH = `${CommonEventName.EVENT_NAME}:getDirectoryPath`;
  static GET_FILE_PATH = `${CommonEventName.EVENT_NAME}:getFilePath`;
  static OPEN_WARNING_DIALOG = `${CommonEventName.EVENT_NAME}:openWarningDialog`;
}
