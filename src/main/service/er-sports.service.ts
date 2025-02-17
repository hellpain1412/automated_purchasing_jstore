import { PurchasingEventName } from "@/common/constant";
import { Product, ScanProductUseCase } from "../use-case";
import { ChromiumCrawlService } from "./chromium-remote.service";
import { XlsxHandlerService } from "./xlsx.service";
import { v4 as uuidv4 } from "uuid";
import { DateTimeUtil } from "../util";
import { ipcMain } from "electron";
import * as fs from "fs";

interface LoginInfo {
  password: string;
  email: string;
}

interface ResultInfo {
  xlsxPath: string;
  resultPath: string;
}

interface ChromeInfo {
  chromePath: string;
  chromeProfilePath: string;
  isRunInBackground: boolean;
}

export class ErSportsDomainService {
  private scanProductUseCase = new ScanProductUseCase();
  private chromeBrowser = new ChromiumCrawlService();
  userInfo: LoginInfo;
  resultInfo: ResultInfo;
  chromeInfo: ChromeInfo;
  event: Electron.IpcMainEvent;

  constructor(
    userInfo: LoginInfo,
    resultInfo: ResultInfo,
    chromeInfo: ChromeInfo,
    event: Electron.IpcMainEvent
  ) {
    this.userInfo = userInfo;
    this.resultInfo = resultInfo;
    this.chromeInfo = chromeInfo;
    this.event = event;
  }

  async stepProcess() {
    try {
      await this.openChrome();
      const { sheetData } = this.readXlSX();
      this.event.reply(
        PurchasingEventName.XLSX_DATA,
        sheetData.map((item) => ({
          productId: item["PRODUCT_ID"],
          id: uuidv4(),
        }))
      );

      const doneProducts: string[] = [];

      let flag = true;
      ipcMain.on(PurchasingEventName.STOP_PROCESS, () => {
        flag = false;
      });

      while (flag) {
        console.log("doneProducts", doneProducts);
        console.log("flag", flag);

        var products = await this.getProductList(sheetData, doneProducts);
        this.event.reply(PurchasingEventName.GET_PRODUCT_LIST, products);
        for (const product of products) {
          try {
            if (!flag) {
              break;
            }

            await this.login();
            this.event.reply(PurchasingEventName.STATUS, {
              productId: product.productId,
              status: "processing",
            });

            await DateTimeUtil.delayRange(1000, 2000);

            // await this.purchasingProduct(
            //   product,
            //   this.userInfo.email,
            //   this.userInfo.password
            // );
            this.event.reply(PurchasingEventName.STATUS, {
              productId: product.productId,
              status: "success",
            });
            doneProducts.push(product.productId);
          } catch (error) {
            this.logError(error);
            console.log(error);
            this.event.reply(PurchasingEventName.STATUS, {
              productId: product.productId,
              status: "retry",
            });
            continue;
          }
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      await this.chromeBrowser.endTask();
      this.event.reply(PurchasingEventName.END_PROCESS, products);
    }
  }

  logError(error: Error) {
    const errorMessage = `[${new Date().toISOString()}] ${JSON.stringify(
      error
    )}\n`;

    fs.appendFile(
      this.resultInfo.resultPath + "/errors.log",
      errorMessage,
      (err) => {
        if (err) console.error("Lỗi khi ghi vào file:", err);
      }
    ); // Ghi đè file cũ
  }

  readXlSX() {
    const Xlsx = XlsxHandlerService.init(this.resultInfo.xlsxPath);
    const [res] = Xlsx.getData();
    return res;
  }

  async getProductList(sheetData: any[], doneProducts: string[]) {
    const products = await Promise.all(
      Array.from({ length: 1 }, (_, i) =>
        this.scanProductUseCase.execute(undefined, i + 1)
      )
    );

    const res: Product[] = [];

    products.flat().forEach((product) => {
      sheetData.find((item) => {
        const isValid = product.name
          .toLowerCase()
          .includes(item["PRODUCT_ID"]?.toLowerCase()?.trim());

        !doneProducts.includes(item["PRODUCT_ID"]) &&
          isValid &&
          res.push({
            ...product,
            productId: item["PRODUCT_ID"],
          });

        return isValid;
      });
    });

    return res;
  }

  async purchasingProduct(product: Product, email: string, password: string) {
    await this.chromeBrowser.purchasingProduct(product, email, password);
  }

  async openChrome() {
    try {
      await this.chromeBrowser.createBrowser(
        this.chromeInfo.chromeProfilePath,
        this.chromeInfo.chromePath,
        this.chromeInfo.isRunInBackground
      );
    } catch (error) {
      console.log(error);
    }
  }

  async login() {
    await this.chromeBrowser.login(this.userInfo.email, this.userInfo.password);
  }
}
