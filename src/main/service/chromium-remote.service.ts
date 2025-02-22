import * as playwright from "playwright-core";
import { DateTimeUtil } from "../util/date-time.util";
import { Product } from "../use-case";
import * as fs from "fs";

export class ChromiumCrawlService {
  private context: playwright.BrowserContext | undefined;
  private page: playwright.Page | undefined;
  constructor() {}

  async createBrowser(
    profilePath: string,
    chromePath: string,
    isRunInBackground: boolean
  ) {
    const { profileDirectoryName, profileDirectoryPath } =
      this.parseUserDirectoryInfo(profilePath);
    // const pathToExtension = `C:\\Users\\PC\\AppData\\Local\\Google\\Chrome\\User Data\\Profile 1\\Extensions\\jonfefokggbliacanjbaiejmbclccocp\\1.0.9_0\\`;
    const pathToExtension = `${profilePath}/Extensions/jonfefokggbliacanjbaiejmbclccocp/1.0.9_0/`;
    console.log(pathToExtension);

    try {
      this.context = await playwright.chromium.launchPersistentContext(
        profilePath,
        {
          headless: isRunInBackground,
          executablePath: chromePath,
          args: [
            // `--profile-directory=${profileDirectoryName}`,
            // "--start-maximized",
            "--lang=en-US",
            "--disable-encryption",
            "--flag-switches-begin",
            "--flag-switches-end",
            // `--disable-extensions-except=${pathToExtension}`,
            // `--load-extension=${pathToExtension}`,
          ],
          ignoreDefaultArgs: ["--enable-automation"],
          viewport: null,
          // proxy: {
          //   server: "47.74.46.81:8047",
          // },
        }
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async login(email: string, password: string) {
    try {
      if (!this.context) {
        return;
      }
      this.page = await this.context?.newPage();
      await this.page?.goto("https://www.cue-shop.jp/index.html");
      await this.page?.waitForLoadState("domcontentloaded");

      const loginPage = this.page?.locator(
        `#l_guide a[href="javascript:ssl_login('member','&code=%2Findex.html')"]`
      );

      const isLogin = await loginPage.isVisible();
      if (isLogin) {
        await loginPage.waitFor({
          state: "visible",
        });

        await loginPage.evaluate((el: HTMLElement) => el.click());
        await DateTimeUtil.delayRange(1000, 1500);
        await this.page?.waitForLoadState("domcontentloaded");

        const emailInput = this.page?.locator(
          `table.loginform input[name="id"]`
        );
        await emailInput.waitFor({
          state: "visible",
        });
        await emailInput.fill(email);

        const passwordInput = this.page?.locator(
          `table.loginform input[name="passwd"]`
        );
        await passwordInput.waitFor({
          state: "visible",
        });
        await passwordInput.fill(password);

        const loginButton = this.page?.locator(
          `div.btn input[onclick="javascript:login_check();"]`
        );
        await loginButton.waitFor({
          state: "visible",
        });
        await loginButton.evaluate((el: HTMLElement) => el.click());
        await DateTimeUtil.delayRange(1500, 2000);
        await this.page?.waitForLoadState("domcontentloaded");
      }

      await this.page?.close();
    } catch (error) {
      console.log(error);
    }
  }

  async createNewPage() {
    const page = await this.context?.newPage();
    return page;
  }

  async closePage(page: playwright.Page) {
    await page?.close();
  }

  async purchasingProduct(
    product: Product,
    email: string,
    password: string,
    page: playwright.Page
  ) {
    try {
      await page?.goto("https://www.cue-shop.jp/shop/basket.html");
      await page?.waitForLoadState("domcontentloaded");

      page.on("dialog", async (alert) => {
        const text = alert.message();
        console.log(text);
        await alert.accept();
      });

      const clearCartButton = page?.locator(
        `.btnBack a[href="JavaScript:basket_clear()"]`
      );

      await clearCartButton.waitFor({
        state: "visible",
      });
      await clearCartButton.evaluate((el: HTMLElement) => el.click());
      await DateTimeUtil.delayRange(800, 1500);
      await page?.waitForLoadState("domcontentloaded");

      await page?.goto(product.url);
      await page?.waitForLoadState("domcontentloaded");

      const buyButton = page?.locator(
        `#basketBtn a[href="JavaScript:send('','');"]`
      );
      const isBuyable = await buyButton.isVisible();
      if (isBuyable) {
        //Step 1
        await buyButton.waitFor({
          state: "visible",
        });
        await buyButton.evaluate((el: HTMLElement) => el.click());
        await DateTimeUtil.delayRange(800, 1500);
        await page?.waitForLoadState("domcontentloaded");

        const proceedCheckoutButton = page?.locator(
          `.btnOrder a[href="javascript:sslorder();"]`
        );
        await proceedCheckoutButton.waitFor({
          state: "visible",
        });
        await proceedCheckoutButton.evaluate((el: HTMLElement) => el.click());
        await DateTimeUtil.delayRange(800, 1500);
        await page?.waitForLoadState("domcontentloaded");

        //Check login form
        const url = page?.url();
        const isLogin = url?.includes("login");
        if (isLogin) {
          const emailInput = page?.locator(`table.loginform input[name="id"]`);
          await emailInput.waitFor({
            state: "visible",
          });
          await emailInput.fill(email);

          const passwordInput = page?.locator(
            `table.loginform input[name="passwd"]`
          );
          await passwordInput.waitFor({
            state: "visible",
          });
          await passwordInput.fill(password);

          const loginButton = page?.locator(
            `div.btn input[value="ログイン"][onclick="javascript:login_check();"]`
          );
          await loginButton.waitFor({
            state: "visible",
          });
          await loginButton.evaluate((el: HTMLElement) => el.click());
          await DateTimeUtil.delayRange(1500, 2000);
          await page?.waitForLoadState("domcontentloaded");
          await page?.waitForURL(
            "https://www.cue-shop.jp/ssl/?ssltype=order&db=cueshopjp"
          );
        }

        //Step 2
        const noPoint = page?.locator(
          `ul.pointSetting li input#shop_point_way_none`
        );
        // const allPoint = page?.locator(
        //   `ul.pointSetting li input#shop_point_way_all`
        // );
        // const customPoint = page?.locator(
        //   `ul.pointSetting li input#shop_point_way_option`
        // );
        await noPoint.waitFor({
          state: "visible",
        });
        await noPoint.evaluate((el: HTMLElement) => el.click());
        await DateTimeUtil.delayRange(800, 1500);
        await page?.waitForLoadState("domcontentloaded");

        const deliveryTime = page?.locator(
          `select.efo_real_check[name="deli_time"]`
        );
        await deliveryTime.waitFor({
          state: "visible",
        });
        await deliveryTime.selectOption("18:00-20:00");
        await DateTimeUtil.delayRange(800, 1500);
        await page?.waitForLoadState("domcontentloaded");

        const nextButton = page?.locator(
          `.nextBtnWrap-step1-area input[name="next_step_button"]`
        );
        await nextButton.waitFor({
          state: "visible",
        });
        await nextButton.evaluate((el: HTMLElement) => el.click());
        await DateTimeUtil.delayRange(800, 1500);
        await page?.waitForLoadState("domcontentloaded");

        //Step 3
        const payMethod = page?.locator(
          `.other-payment input.efo_real_check[value="R"][name="paymethod"]`
        );
        await payMethod.waitFor({
          state: "visible",
        });
        await payMethod.evaluate((el: HTMLElement) => el.click());
        await DateTimeUtil.delayRange(800, 1500);
        await page?.waitForLoadState("domcontentloaded");

        const deliveryMethod = page?.locator(
          `select.efo_real_check[name="repay_method_20180706090509"]`
        );
        await deliveryMethod.waitFor({
          state: "visible",
        });
        await deliveryMethod.selectOption("現金支払い");
        await DateTimeUtil.delayRange(800, 1500);
        await page?.waitForLoadState("domcontentloaded");

        const nextButton_2 = page?.locator(`.nextBtnWrap input#next_button`);
        await nextButton_2.waitFor({
          state: "visible",
        });
        await nextButton_2.evaluate((el: HTMLElement) => el.click());

        await page?.waitForURL("https://www.cue-shop.jp/ssl/orderconfirm.html");
        await DateTimeUtil.delayRange(1100, 2000);

        //Step 4
        // const confirmBuyButton = page?.locator(
        //   `.orderBtn .responsiveDesignOrderButton`
        // );
        // await confirmBuyButton.waitFor({
        //   state: "visible",
        // });
        // await confirmBuyButton.evaluate((el: HTMLElement) => el.click());
        // await DateTimeUtil.delayRange(1000, 1500);
        // await page?.waitForLoadState("domcontentloaded");
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  parseUserDirectoryInfo(profilePath: string) {
    const lastIndex = profilePath.lastIndexOf("/");
    const profileDirectoryName = profilePath.substring(lastIndex + 1);
    const profileDirectoryPath = profilePath.slice(0, lastIndex + 1);
    return { profileDirectoryName, profileDirectoryPath };
  }

  async endTask() {
    await this.context?.close();
  }
}
