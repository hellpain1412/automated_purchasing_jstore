import { PurchasingEventName } from "@/common/constant/event";
import * as cheerio from "cheerio";
import { ipcMain, net } from "electron";

export class PurchasingEvent {
  static startProcess() {
    ipcMain.on(
      PurchasingEventName.START_PROCESS,
      async (event, processInfo) => {
        console.log(processInfo);
        const url =
          "https://www.er-sports.com/shop/shopbrand.html?page=1&search=mezz&sort=price_desc&money1=&money2=&prize1=&company1=&content1=&originalcode1=&category=&subcategory=";
        let data = "";
        const response = await net.fetch(url, {
          method: "GET",
          credentials: "same-origin",
        });
        data = await response.text();
        let $ = cheerio.load(data);
        const errCode = response.status;
        console.log(errCode);
        event.reply(PurchasingEventName.END_PROCESS, errCode);
      }
    );
  }
}
