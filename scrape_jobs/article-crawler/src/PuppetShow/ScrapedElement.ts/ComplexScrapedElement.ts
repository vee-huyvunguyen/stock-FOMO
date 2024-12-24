import { ClickOptions, ElementHandle, JSHandle, Page } from 'puppeteer';
import ScrapedElement from '.';

class ComplexScrapedElement implements ScrapedElement<Page, ElementHandle> {
  constructor(
    public element: ElementHandle,
    public selector: string,
    public page: Page,
  ) {
    this.element = element;
    this.selector = selector;
    this.page = page;
  }
  async getProperty(propertyName: string): Promise<string> {
    const valueHandle: JSHandle = await this.element.getProperty(propertyName);
    const propertyValue = (await valueHandle.jsonValue()) as string;

    if (propertyValue) {
      return propertyValue;
    } else {
      // console.log(await this.element.);
      throw new Error(
        `Cant get property "${propertyName}", it might not exist!!!`,
      );
    }
  }
  async getAttribute(attributeName: string): Promise<string> {
    const attributeValue = await this.element.evaluate(
      (element, attributeName) => {
        return element.getAttribute(attributeName);
      },
      attributeName,
    );

    if (attributeValue) {
      return attributeValue;
    } else {
      // console.log(await this.element.);
      throw new Error(
        `Cant get attribute "${attributeName}", it might not exist!!!`,
      );
    }
  }
  async text(): Promise<string> {
    return await this.getProperty('textContent');
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
    await this.element.click(option);
  }
}

export default ComplexScrapedElement;
