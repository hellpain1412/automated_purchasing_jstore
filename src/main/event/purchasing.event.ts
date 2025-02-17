import { PurchasingEventName } from "@/common/constant/event.constant";
import { ipcMain } from "electron";
import { ErSportsDomainService } from "../service";

export class PurchasingEvent {
  constructor() {}
  static startProcess() {
    ipcMain.on(
      PurchasingEventName.START_PROCESS,
      async (event, processInfo) => {
        const {
          password,
          email,
          xlsxPath,
          resultPath,
          chromePath,
          chromeProfilePath,
          isRunInBackground,
        } = processInfo;
        const erSportsDomainService = new ErSportsDomainService(
          {
            password,
            email,
          },
          { xlsxPath, resultPath },
          {
            chromePath,
            chromeProfilePath,
            isRunInBackground,
          },
          event
        );
        await erSportsDomainService.stepProcess();
      }
    );
  }
}
