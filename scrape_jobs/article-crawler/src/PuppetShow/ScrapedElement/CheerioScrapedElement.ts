import { CheerioAPI } from 'cheerio';
import { Element } from 'domhandler';
import { ScrapedElement } from '../ScrapedElement/index.js';

class CheerioScrapedElement implements ScrapedElement<CheerioAPI, Element> {
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
    }
    throw Error(`Cant find element with selector: "${attributeName}"`);
  }

  async getProperty(propertyName: string): Promise<string> {
    const value = this.page(this.element).prop(propertyName);
    return this.checkRetrievedAttribute(value?.toString(), propertyName);
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

  async click(): Promise<void> {
    throw Error('Cant click on element');
  }

  async getOuterHTML(): Promise<string> {
    return this.page(this.element).toString();
  }
}

export default CheerioScrapedElement;
