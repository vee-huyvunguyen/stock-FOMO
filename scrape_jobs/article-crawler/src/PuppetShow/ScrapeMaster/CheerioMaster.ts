import { BaseWatcher } from '@/PuppetShow/TheWatcher/BaseWatcher';
import { ScrapeMaster, ScrapeMasterConfig } from '@/PuppetShow/ScrapeMaster';
import { CheerioAPI, load as CherioLoad, Element } from 'cheerio';
import CheerioScrapedElement from '@/PuppetShow/ScrapedElement/CheerioScrapedElement';
import axios, { AxiosRequestConfig } from 'axios';
import isEmpty from 'lodash/isEmpty';
import { RobotsFile } from 'crawlee';
import isUndefined from 'lodash/isUndefined';

type Miliseconds = number;

/**
 * Implementation of `PuppetMaster`,
 * using `axios` to request static html, and load it into a `CheerioAPI` object,
 * using `Cheerio` selectors to get `Element`
 */
class CheerioMaster implements ScrapeMaster<CheerioAPI, Element> {
  constructor(
    public config: ScrapeMasterConfig,
    public watcher: BaseWatcher,
    public page?: CheerioAPI,
    public loadedURL?: string,
    public axiosRequestConfig?: AxiosRequestConfig,
  ) {
    if (isUndefined(loadedURL) != isUndefined(page)) {
      throw new Error(
        '`loadedURL` must be parsed with `page`, or both must be undefined',
      );
    }
    this.watcher = watcher;
    this.page = page;
    this.config = this.initConfig(config);
    this.loadedURL = loadedURL;
    this.axiosRequestConfig = axiosRequestConfig;
  }
  async getRobotsFile(): Promise<RobotsFile> {
    return await RobotsFile.find(this.currentURL());
  }
  initConfig(config: ScrapeMasterConfig): ScrapeMasterConfig {
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
    element: CheerioScrapedElement,
    elementName?: string,
  ): CheerioScrapedElement {
    if (this.config.logNullElement && elementName) {
      this.watcher?.checkError(element.element, {
        msg: `Cant find ${elementName} element, at xpath: ${element.selector}`,
      });
    }
    return element;
  }
  static async loadCheerioAPI(
    url: string,
    axiosRequestConfig?: AxiosRequestConfig,
  ): Promise<CheerioAPI> {
    const { data } = await axios.get(url, axiosRequestConfig);
    return CherioLoad(data);
  }
  async goto(url: string): Promise<void> {
    this.watcher?.info({ msg: 'Loading ' + url });
    this.page = await CheerioMaster.loadCheerioAPI(
      url,
      this.axiosRequestConfig,
    );
    this.loadedURL = url;
    this.checkPage();
  }
  currentURL(): string {
    if (isUndefined(this.loadedURL)) {
      throw new Error(
        'CheerioMaster: `loadedURL` is undefined, maybe the page is not loaded yet',
      );
    }
    return this.loadedURL;
  }
  async delay(duration: Miliseconds) {
    return new Promise(function (resolve) {
      setTimeout(resolve, duration);
    });
  }
  async selectElements(
    selector: string,
    parentElement?: CheerioScrapedElement | undefined,
    elementName?: string | undefined,
  ): Promise<CheerioScrapedElement[]> {
    if (!this.page) {
      throw new Error(
        'CheerioMaster: `page` is undefined, maybe the page is not loaded yet',
      );
    } else {
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
        (ele) =>
          new CheerioScrapedElement(
            ele as Element,
            selector,
            this.page as CheerioAPI,
          ),
      );
    }
  }
  async selectElement(
    selector: string,
    parentElement?: CheerioScrapedElement,
    elementName?: string | undefined,
  ): Promise<CheerioScrapedElement | undefined> {
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
      const href = (await ele.href()) || '';
      const text = await ele.text();
      foundHrefTexts.push({ href, text });
    }
    return foundHrefTexts;
  }
  async getPageTitle(): Promise<string> {
    if (!this.page) {
      throw new Error(
        'CheerioMaster: `page` is undefined, maybe the page is not loaded yet',
      );
    }
    return this.page('title').text();
  }
  async close(): Promise<void> {
    this.watcher.info({ msg: 'End of NoobMaster' });
  }
}

export default CheerioMaster;
