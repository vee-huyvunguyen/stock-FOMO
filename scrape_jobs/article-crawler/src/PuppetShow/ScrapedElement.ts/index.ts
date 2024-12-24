import { ClickOptions } from 'puppeteer';

interface ScrapedElement<P, E> {
  element: E;
  selector: string;
  page?: P;
  getProperty(propertyName: string): Promise<string>;
  getAttribute(attributeName: string): Promise<string>;
  text(): Promise<string>;
  href(): Promise<string>;
  hrefAndText(): Promise<{ href: string; text: string }>;
  click(option?: ClickOptions): Promise<void>;
}

export default ScrapedElement;
