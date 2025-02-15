import * as playwright from "playwright";
import * as cheerio from "cheerio";

export class ChromiumCrawlService {
  private browser: playwright.Browser | undefined;
  private context: playwright.BrowserContext | undefined;
  private page: playwright.Page | undefined;
  constructor() {}

  async createBrowser() {
    this.browser = await playwright.chromium.launch({
      headless: false,
      // proxy: {
      //   server: this.botConfig.proxy,
      //   username: 'hellpain1412',
      //   password: 'testpass123',
      // },
    });

    // this.context = await this.browser.newContext({
    //   userAgent:
    //     userAgentsList[Math.floor(Math.random() * userAgentsList.length)],
    // });
    this.page = await this.context.newPage();
  }

  async endTask() {
    await this.context.close();
    await this.browser.close();
  }
}
