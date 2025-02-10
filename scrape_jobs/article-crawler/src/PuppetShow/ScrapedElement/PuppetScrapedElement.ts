import { ClickOptions, ElementHandle, JSHandle, Page } from 'puppeteer';
import { ScrapedElement } from '@/PuppetShow/ScrapedElement';

class PuppetScrapedElement implements ScrapedElement<Page, ElementHandle> {
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
    try {
      const text = await this.element.evaluate(el => {
        // Use innerText for rendered text, fallback to shadow DOM
        return (el as HTMLElement).innerText?.trim() ||
          el.shadowRoot?.textContent?.trim() ||
          '';
      });

      return text; // Returns empty string for truly empty content
    } catch (error) {
      throw new Error(`Failed to retrieve text for selector ${this.selector}: ${error}`);
    }
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

  /**
   * Get the the outer HTML: HTML of the Element, and children elements
   */
  async getOuterHTML(): Promise<string> {
    return await this.getProperty('outerHTML');
  }
}

export default PuppetScrapedElement;
