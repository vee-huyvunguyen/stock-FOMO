import { ClickOptions } from 'puppeteer';
import { CheerioAPI, Element } from 'cheerio';

type ElementHTML = string;
type ElementTextContent = string;

interface ScrapedElement<P = CheerioAPI, E = Element> {
  element: E;
  selector: string;
  page?: P;
  getProperty(propertyName: string): Promise<string>;
  getAttribute(attributeName: string): Promise<string>;
  text(): Promise<ElementTextContent>;
  href(): Promise<string>;
  hrefAndText(): Promise<{ href: string; text: ElementTextContent }>;
  click(option?: ClickOptions): Promise<void>;
  getOuterHTML(): Promise<ElementHTML>;
}

export { ScrapedElement, ElementTextContent, ElementHTML };
