import { PurchasingEventName } from "@/common/constant/event.constant";
import { ipcMain } from "electron";
import { CueShopDomainService, XlsxHandlerService } from "../service";

export class PurchasingEvent {
  constructor() {}
  static startProcess() {
    ipcMain.on(
      PurchasingEventName.START_PROCESS,
      async (event, processInfo) => {
        const {
          xlsxPath,
          resultPath,
          chromePath,
          chromeProfilePath: accountList,
          isRunInBackground,
        } = processInfo;

        const Xlsx = XlsxHandlerService.init(accountList);
        const [res] = Xlsx.getData();

        let stopProcess = false;
        ipcMain.on(PurchasingEventName.STOP_PROCESS, () => {
          stopProcess = true;
        });

        for (let i = 0; i < res.sheetData.length; i++) {
          const item = res.sheetData[i];
          if (stopProcess) {
            break;
          }
          const {
            EMAIL: email,
            PASSWORD: password,
            PROFILE_PATH: chromeProfilePath,
          } = item;

          const erSportsDomainService = new CueShopDomainService(
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

        console.log("PurchasingEvent.startProcess completed");
      }
    );
  }
}
