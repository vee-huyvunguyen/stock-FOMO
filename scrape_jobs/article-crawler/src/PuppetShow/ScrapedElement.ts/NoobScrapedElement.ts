import { ClickOptions } from 'puppeteer';
import ScrapedElement from '.';
import { Element, CheerioAPI } from 'cheerio';

class NoobScrapedElement implements ScrapedElement<CheerioAPI, Element> {
  constructor(
    public element: Element,
    public selector: string,
    public page: CheerioAPI,
  ) {
    this.element = element;
    this.selector = selector;
    this.page = page;
  }
  checkRetrievedAttribute(
    attribute: undefined | string,
    attributeName: string,
  ): string {
    if (attribute) {
      return attribute;
    } else {
      throw Error(`Cant find element with selector: "${attributeName}"`);
    }
  }
  async getProperty(propertyName: string): Promise<string> {
    return await this.getAttribute(propertyName);
  }
  async getAttribute(attributeName: string): Promise<string> {
    return this.checkRetrievedAttribute(
      this.element.attribs[attributeName],
      attributeName,
    );
  }
  async text(): Promise<string> {
    return this.page(this.element).text();
  }
  async href(): Promise<string> {
    return await this.getProperty('href');
  }
  async hrefAndText(): Promise<{ href: string; text: string }> {
    const href = await this.href();
    const text = await this.text();
    return { href, text };
  }
  async click(option?: ClickOptions): Promise<void> {
    option;
    return;
  }
}

export default NoobScrapedElement;
