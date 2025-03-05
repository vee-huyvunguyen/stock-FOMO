import { Page, Browser, GoToOptions, ElementHandle } from 'puppeteer';
import { RobotsFile } from 'crawlee';
import PuppetScrapedElement from '../ScrapedElement/PuppetScrapedElement.js';
import { BaseWatcher } from '../TheWatcher/BaseWatcher.js';
import { ScrapeMaster, ScrapeMasterConfig } from '../ScrapeMaster/index.js';

type Miliseconds = number;
type PSelector = string;
type HttpUrl = string;

export default class PuppetMaster implements ScrapeMaster<Page, ElementHandle> {
  constructor(
    public page: Page,
    public browser: Browser,
    public config: ScrapeMasterConfig,
    public watcher?: BaseWatcher,
  ) {
    this.browser = browser;
    this.page = page;
    this.watcher = watcher;
    this.config = this.initConfig(config);
  }

  async getRobotsFile(): Promise<RobotsFile> {
    return await RobotsFile.find(this.currentURL());
  }

  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Scrolls to the end of the page smoothly over a specified duration
   * @param {Miliseconds} duration - Time in milliseconds to complete the scroll (default: 3000ms)
   * @returns {Promise<void>}
   */
  async scrollToEnd(duration: Miliseconds = 3000): Promise<void> {
    const page = this.checkPage();

    // Get initial scroll height
    const scrollHeight = await page.evaluate(() => document.body.scrollHeight);

    // Calculate how many steps we need for a smooth scroll
    // Aiming for roughly 60fps (16.7ms per frame)
    const steps = Math.floor(duration / 16.7);
    const scrollStep = scrollHeight / steps;

    // Perform the scroll in steps
    for (let i = 0; i < steps; i++) {
      await page.evaluate((step, currentStep) => {
        window.scrollTo(0, step * (currentStep + 1));
      }, scrollStep, i);

      // Small delay between scroll steps
      await this.delay(16.7);
    }

    // Ensure we've reached the bottom
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
  }

  /**
   * Check for undefined/missing fields in config, an replace theme with default values
   * @param {any} config:PuppetMasterConfig to be checked
   * @returns {any}
   */
  initConfig(config: ScrapeMasterConfig): ScrapeMasterConfig {
    config.defaultGotoOptions = config.defaultGotoOptions ?? {
      waitUntil: 'networkidle2',
    };
    config.defaultViewport = config.defaultViewport ?? {
      width: 1280,
      height: 800,
      deviceScaleFactor: 1,
    };
    return config;
  }

  logErrorNullElement(
    element: PuppetScrapedElement,
    elementName?: string,
  ): PuppetScrapedElement {
    if (this.config.logNullElement && elementName) {
      this.watcher?.checkError(element.element, {
        msg: `Cant find ${elementName} element, at xpath: ${element.selector}`,
      });
    }
    return element;
  }

  /**
   * Delay whole programm for miliseconds,
   * @param number duration:Miliseconds
   */
  async delay(duration: Miliseconds) {
    return new Promise((resolve) => {
      setTimeout(resolve, duration);
    });
  }

  async goto(url: HttpUrl, customGotoOptions?: GoToOptions): Promise<void> {
    this.page.setDefaultNavigationTimeout(0);
    this.watcher?.info({ msg: `Loading ${url}` });
    await Promise.all([
      this.page.waitForNavigation(),
      this.page?.goto(url, customGotoOptions ?? this.config.defaultGotoOptions),
    ]);
  }

  checkPage(): Page {
    if (this.page === null || this.page === undefined) {
      throw new Error('Undefined `page`, created page first');
    } else {
      return this.page;
    }
  }

  /**
   * Select and get the elements based on provided `selector`,
   * if pair-using with a parentElement, `selector` will be used as a `p-selector`.
   * If not, `selector` will be treated as an `xpath`.
   * @param {any} selector:XPathExpression (or PSelector, if a parentElement is parsed)
   * @param {any} parentElement?:ScrapedElement
   * @param {any} elementName?:string for logging
   * @returns {any}
   */
  async selectElements(
    selector: PSelector | XPathExpression,
    parentElement?: PuppetScrapedElement,
    elementName?: string,
  ): Promise<PuppetScrapedElement[]> {
    let elements = [];
    if (parentElement) {
      // this.page.waitForSelector(selector as string, )
      elements = await parentElement.element.$$(selector as string);
    } else {
      elements = await this.checkPage().$$(selector as string);
    }

    const scrapedElements = elements.map((ele) => this.logErrorNullElement(
      new PuppetScrapedElement(
          ele as ElementHandle,
          selector as string,
          this.page,
      ),
      elementName,
    ),
    );
    return scrapedElements;
  }

  async selectElement(
    selector: PSelector | XPathExpression,
    parentElement?: PuppetScrapedElement,
    elementName: string = '',
  ): Promise<PuppetScrapedElement | undefined> {
    const elements = await this.selectElements(
      selector,
      parentElement,
      elementName,
    );
    return elements[0];
  }

  async allTagAHrefsTexts(): Promise<{ href: HttpUrl; text: string }[]> {
    const hrefsTexts = await this.page.$$eval('a', (as) => as.map((a) => ({
      href: a.href,
      text: a.textContent as string,
    })),
    );
    return hrefsTexts;
  }

  async close(): Promise<void> {
    await this.browser.close();
  }

  currentURL(): string {
    return this.page.url();
  }
}
