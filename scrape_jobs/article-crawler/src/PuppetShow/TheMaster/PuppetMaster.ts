import { Page, Browser, GoToOptions, ElementHandle } from 'puppeteer';
import PuppetScrapedElement from '../ScrapedElement.ts/PuppetScrapedElement';
import { BaseWatcher } from '../TheWatcher/BaseWatcher';
import { TheMaster, TheMasterConfig } from '.';

type Miliseconds = number;
type PSelector = string;
type HttpUrl = string;

export default class PuppetMaster implements TheMaster<Page, ElementHandle> {
  constructor(
    public page: Page,
    public browser: Browser,
    public config: TheMasterConfig,
    public watcher?: BaseWatcher,
  ) {
    this.browser = browser;
    this.page = page;
    this.watcher = watcher;
    this.config = this.initConfig(config);
  }
  /**
   * Check for undefined/missing fields in config, an replace theme with default values
   * @param {any} config:PuppetMasterConfig to be checked
   * @returns {any}
   */
  initConfig(config: TheMasterConfig): TheMasterConfig {
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
    return new Promise(function (resolve) {
      setTimeout(resolve, duration);
    });
  }
  async goto(url: HttpUrl, customGotoOptions?: GoToOptions): Promise<void> {
    this.page.setDefaultNavigationTimeout(0);
    this.watcher?.info({ msg: 'Loading ' + url });
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
   * Select and get the elements based on provided `selector`, if pair-using with a parentElement, `selector` will be used as a `p-selector`. If not, `selector` will be treated as an `xpath`.
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

    const scrapedElements = elements.map((ele) =>
      this.logErrorNullElement(
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
    const hrefsTexts = await this.page.$$eval('a', (as) =>
      as.map((a) => ({
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
