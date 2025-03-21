import { CheerioAPI } from 'cheerio';
import { Element } from 'domhandler';
import { RobotsFile } from 'crawlee';
import { Viewport, GoToOptions } from 'puppeteer';
import { BaseWatcher } from '../TheWatcher/BaseWatcher.js';
import {
  ScrapedElement,
  ElementTextContent,
} from '../ScrapedElement/index.js';

type Miliseconds = number;
type CSSSelector = string;
type HttpUrl = string;
interface ScrapeMasterConfig {
  logNullElement: boolean;
  defaultGotoOptions?: GoToOptions;
  defaultViewport?: Viewport;
}

interface ScrapeMaster<P = CheerioAPI, E = Element> {
  page?: P;
  config: ScrapeMasterConfig;
  watcher?: BaseWatcher | undefined;
  /**
   * Check for undefined/missing fields in config, and replace them with default values
   * @param {any} config:PuppetMasterConfig to be checked
   * @returns {any}
   */
  initConfig(config: ScrapeMasterConfig): ScrapeMasterConfig;
  /**
   * Check if an element is null/undefined/empty to log it, return the element itself
   * @param {any} element:ScrapedElement
   * @param {any} elementName?:string to log, if the parsed element is null/undefined/empty
   * @returns {any}
   */
  logErrorNullElement(
    element: ScrapedElement<P, E>,
    elementName?: string,
  ): ScrapedElement<P, E>;
  /**
   * Delay whole scraping process for miliseconds,
   * @param number duration:Miliseconds
   */
  delay(duration: Miliseconds): void;
  /**
   * Go to a page in puppeteer, or load html into this.page
   * @param {any} url:HttpUrl
   * @returns {any}
   */
  goto(url: HttpUrl): Promise<void>;
  /**
   * Check if loaded this.page is empty/null/undefined
   * @returns {any}
   */
  checkPage(): P;
  /**
   * Select and get the elements based on provided `selector`
   * @param {any} selector:XPathExpression (or PSelector, if used with puppeteer)
   * @param {any} parentElement?:ScrapedElement
   * @param {any} elementName?:string for logging
   * @returns {any}
   */
  selectElements(
    selector: CSSSelector,
    parentElement?: ScrapedElement<P, E>,
    elementName?: string,
  ): Promise<ScrapedElement<P, E>[]>;
  /**
   * Select and get the element based on provided `selector`
   * @param {any} selector:PSelector|XPathExpression|string
   * @param {any} parentElement?:ScrapedElement
   * @param {any} elementName?:string for logging
   * @returns {any}
   */
  selectElement(
    selector: CSSSelector | XPathExpression | string,
    parentElement?: ScrapedElement<P, E>,
    elementName?: string,
  ): Promise<ScrapedElement<P, E> | undefined>;
  /**
   * get all tags and hrefs in this.page
   * @returns {any}
   */
  allTagAHrefsTexts(): Promise<{ href: HttpUrl; text: ElementTextContent }[]>;
  /**
   * Close the puppeteer browser/page, or unload the html by assigning this.page to `underfined`
   * @returns {any}
   */
  close(): Promise<void>;
  /**
   * Extract current URL, in case of redirecting
   * @returns {any}
   */
  currentURL(): string;
  /**
   * Get the RobotsFile object from the current Page (URL)
   * @returns {any}
   */
  getRobotsFile(): Promise<RobotsFile>;

  /**
   * Get the title of the loaded URL
   * @returns {string}
   */
  getPageTitle(): Promise<ElementTextContent>;
}

export { ScrapeMaster, ScrapeMasterConfig, CSSSelector };
