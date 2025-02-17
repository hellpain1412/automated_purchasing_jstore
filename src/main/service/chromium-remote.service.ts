import * as playwright from "playwright-core";
import { DateTimeUtil } from "../util/date-time.util";
import { Product } from "../use-case";

export class ChromiumCrawlService {
  private context: playwright.BrowserContext | undefined;
  private page: playwright.Page | undefined;
  constructor() {}

  async createBrowser(
    profilePath: string,
    chromePath: string,
    isRunInBackground: boolean
  ) {
    // const { profileDirectoryName, profileDirectoryPath } =
    //   this.parseUserDirectoryInfo(profilePath);
    // const pathToExtension = `/home/hellpain/.config/google-chrome/Profile 3/Extensions/jonfefokggbliacanjbaiejmbclccocp/1.0.9_0/`;
    try {
      this.context = await playwright.chromium.launchPersistentContext(
        profilePath,
        {
          headless: isRunInBackground,
          executablePath: chromePath,
          args: [
            // `--profile-directory=${profileDirectoryName}`,
            "--start-maximized",
            "--lang=en-US",
            "--disable-encryption",
            "--flag-switches-begin",
            "--flag-switches-end",
            // `--disable-extensions-except=${pathToExtension}`,
            // `--load-extension=${pathToExtension}`,
          ],
          ignoreDefaultArgs: ["--enable-automation"],
          viewport: { width: 1920, height: 1080 },
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
      await this.page?.goto("https://www.er-sports.com/index.html");
      await this.page?.waitForLoadState("domcontentloaded");

      const loginPage = this.page?.locator(
        `#header ul li a[href="javascript:ssl_login('login')"]`
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
        await DateTimeUtil.delayRange(500, 1200);
        await this.page?.waitForLoadState("domcontentloaded");
      }

      await this.page?.close();
    } catch (error) {
      console.log(error);
    }
  }

  async purchasingProduct(product: Product, email: string, password: string) {
    try {
      const page = await this.context?.newPage();
      await page?.goto(product.url);
      await page?.waitForLoadState("domcontentloaded");

      const buyButton = page?.locator(
        `.item-basket-btn a.btn-basket[href="JavaScript:send('','');"]`
      );
      const isBuyable = await buyButton.isVisible();
      if (isBuyable) {
        //Step 1
        await buyButton.waitFor({
          state: "visible",
        });
        await buyButton.evaluate((el: HTMLElement) => el.click());
        await DateTimeUtil.delayRange(500, 1300);
        await page?.waitForLoadState("domcontentloaded");

        const proceedCheckoutButton = page?.locator(
          `.btn-wrap-order a[href="javascript:sslorder();"]`
        );
        await proceedCheckoutButton.waitFor({
          state: "visible",
        });
        await proceedCheckoutButton.evaluate((el: HTMLElement) => el.click());
        await DateTimeUtil.delayRange(500, 1300);
        await page?.waitForLoadState("domcontentloaded");

        //Check login form
        const url = page?.url();
        console.log(url);

        const isLogin = url?.includes("login");
        console.log(isLogin);

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
            `div.btn input[onclick="javascript:login_check();"]`
          );
          await loginButton.waitFor({
            state: "visible",
          });
          await loginButton.evaluate((el: HTMLElement) => el.click());
          await DateTimeUtil.delayRange(500, 1300);
          await page?.waitForLoadState("domcontentloaded");
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
        await DateTimeUtil.delayRange(500, 1300);
        await page?.waitForLoadState("domcontentloaded");

        const deliveryTime = page?.locator(
          `select.efo_real_check[name="deli_time"]`
        );
        await deliveryTime.waitFor({
          state: "visible",
        });
        await deliveryTime.selectOption("18:00-21:00");
        await DateTimeUtil.delayRange(500, 1300);
        await page?.waitForLoadState("domcontentloaded");

        const nextButton = page?.locator(
          `.nextBtnWrap-step1-area input[name="next_step_button"]`
        );
        await nextButton.waitFor({
          state: "visible",
        });
        await nextButton.evaluate((el: HTMLElement) => el.click());
        await DateTimeUtil.delayRange(500, 1300);
        await page?.waitForLoadState("domcontentloaded");

        //Step 3
        const payMethod = page?.locator(
          `.other-payment input.efo_real_check[value="R"][name="paymethod"]`
        );
        await payMethod.waitFor({
          state: "visible",
        });
        await payMethod.evaluate((el: HTMLElement) => el.click());
        await DateTimeUtil.delayRange(500, 1300);
        await page?.waitForLoadState("domcontentloaded");

        const deliveryMethod = page?.locator(
          `input.deli_method[value="20130417231515"][name="deli_method"]`
        );
        await deliveryMethod.waitFor({
          state: "visible",
        });
        await deliveryMethod.evaluate((el: HTMLElement) => el.click());
        await DateTimeUtil.delayRange(500, 1300);
        await page?.waitForLoadState("domcontentloaded");

        const nextButton_2 = page?.locator(`.nextBtnWrap input#next_button`);
        await nextButton_2.waitFor({
          state: "visible",
        });
        await nextButton_2.evaluate((el: HTMLElement) => el.click());
        await DateTimeUtil.delayRange(500, 1300);
        await page?.waitForLoadState("domcontentloaded");
      } else {
        await page?.close();
      }
      await page?.close();
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
