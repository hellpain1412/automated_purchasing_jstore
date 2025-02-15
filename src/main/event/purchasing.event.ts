import { PurchasingEventName } from "@/common/constant/event.constant";
import { ipcMain } from "electron";
import { ErSportsDomainService } from "../service/er-sports.service";

export class PurchasingEvent {
  constructor() {}
  static startProcess() {
    ipcMain.on(
      PurchasingEventName.START_PROCESS,
      async (event, processInfo) => {
        console.log(processInfo);
        const erSportsDomainService = new ErSportsDomainService();
        const result = await erSportsDomainService.getProductList();

        event.reply(PurchasingEventName.END_PROCESS, result);
      }
    );
  }
}
