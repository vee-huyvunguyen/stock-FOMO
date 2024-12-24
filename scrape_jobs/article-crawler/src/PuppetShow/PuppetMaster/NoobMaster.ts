import { BaseWatcher } from '../TheWatcher/BaseWatcher';
import { PuppetMaster, PuppetMasterConfig } from '.';
import { CheerioAPI, load as CherioLoad, Element } from 'cheerio';
import NoobScrapedElement from '../ScrapedElement.ts/NoobScrapedElement';
import axios from 'axios';
import isEmpty from 'lodash/isEmpty';

type Miliseconds = number;

/**
 * Implementation of `PuppetMaster`,
 * using `axios` to request static html, and load it into a `CheerioAPI` object,
 * using `Cheerio` selectors to get `Element`
 */
class NoobMaster implements PuppetMaster<CheerioAPI, Element> {
  constructor(
    public config: PuppetMasterConfig,
    public page: CheerioAPI,
    public watcher: BaseWatcher,
    public loadedURL: string,
  ) {
    this.watcher = watcher;
    this.page = page;
    this.config = this.initConfig(config);
    this.loadedURL = loadedURL;
  }
  initConfig(config: PuppetMasterConfig): PuppetMasterConfig {
    return config;
  }
  checkPage(): CheerioAPI {
    if (this.page === null || this.page === undefined) {
      throw new Error('Undefined `page`, created page first');
    } else {
      return this.page;
    }
  }
  logErrorNullElement(
    element: NoobScrapedElement,
    elementName?: string,
  ): NoobScrapedElement {
    if (this.config.logNullElement && elementName) {
      this.watcher?.checkError(element.element, {
        msg: `Cant find ${elementName} element, at xpath: ${element.selector}`,
      });
    }
    return element;
  }
  static async loadCheerioAPI(url: string): Promise<CheerioAPI> {
    const { data } = await axios.get(url);
    return CherioLoad(data);
  }
  async goto(url: string): Promise<void> {
    this.page = await NoobMaster.loadCheerioAPI(url);
    this.loadedURL = url;
    this.checkPage();
  }
  currentURL(): string {
    return this.loadedURL;
  }
  async delay(duration: Miliseconds) {
    return new Promise(function (resolve) {
      setTimeout(resolve, duration);
    });
  }
  async selectElements(
    selector: string,
    parentElement?: NoobScrapedElement | undefined,
    elementName?: string | undefined,
  ): Promise<NoobScrapedElement[]> {
    let foundCheerioElements: Element[] = this.checkPage()(
      selector,
      parentElement?.element,
    ).get() as Element[];
    if (isEmpty(foundCheerioElements)) {
      this.watcher.warn({
        msg: `Cant find element '${elementName}' with selector ${selector}`,
      });
    }
    return foundCheerioElements.map(
      (ele) => new NoobScrapedElement(ele as Element, selector, this.page),
    );
  }
  async selectElement(
    selector: string,
    parentElement?: NoobScrapedElement,
    elementName?: string | undefined,
  ): Promise<NoobScrapedElement | undefined> {
    const foundElements = await this.selectElements(
      selector,
      parentElement,
      elementName,
    );
    if (isEmpty(foundElements)) {
      return undefined;
    }
    return foundElements[0];
  }
  async allTagAHrefsTexts(): Promise<{ href: string; text: string }[]> {
    const foundTagAs = await this.selectElements('a');
    const foundHrefTexts = [];
    for (const ele of foundTagAs) {
      const href = (await ele.getAttribute('href')) || '';
      const text = await ele.text();
      foundHrefTexts.push({ href, text });
    }
    return foundHrefTexts;
  }
  async close(): Promise<void> {
    this.watcher.info({ msg: 'End of NoobMaster' });
  }
}

export default NoobMaster;
