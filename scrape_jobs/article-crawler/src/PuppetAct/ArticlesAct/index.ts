import {
  ElementHTML,
  ElementTextContent,
  ScrapedElement,
} from '@/PuppetShow/ScrapedElement';
import { CSSSelector, ScrapeMaster } from '@/PuppetShow/ScrapeMaster';
import { getErrorMessage } from '@/utils';
import {
  ElementsPageTypeConfig,
  PageType,
  TypeBaseCSSSelector,
} from '@/PuppetAct/CSSselectors';
import { RawArticlePage } from '@/PuppetAct/ArticlesAct/schemas';
import {
  ScrapeStatusHandler,
  ScrapeStatus,
} from '@/PuppetAct/ArticlesAct/ScrapeStatusHandler';
import { DateTime } from 'luxon';

type PageClassification =
  | {
    success: true;
    pageType: 'mainArticle' | string;
  }
  | {
    success: false;
    pageType: undefined;
  };
type OtherLinks = {
  other: string[];
  news: string[];
};

type ArticleInfoExtractor = () => Promise<RawArticlePage>;
type ElementExtractCheck =
  | {
    isError: false;
    element: ScrapedElement;
    propertyValue: ElementTextContent;
  }
  | { isError: true; element: ScrapedElement; eleHTML?: ElementHTML } // error, but can debug with html
  | { isError: true; eleHTML: undefined }; // error, failed to extract element

type ElementExtractedContent = {
  textContent?: ElementTextContent;
  eleHTML?: ElementHTML;
};
type ElementsExtractedContent = {
  textContent: ElementTextContent[];
  eleHTML: ElementHTML[];
};
abstract class ArticleAct {
  protected _statusHandler: ScrapeStatusHandler;

  constructor(
    public scrapeMaster: ScrapeMaster,
    public articleURL: string,
    public elements: TypeBaseCSSSelector,
    public manualPageType?: string,
  ) {
    this._statusHandler = ScrapeStatusHandler.new();
    if (manualPageType) {
      this._statusHandler.updateManuallyParsedPageType(manualPageType);
    }
    this.scrapeMaster = scrapeMaster;
    this.articleURL = articleURL;
    this.elements = elements;
    this.manualPageType = manualPageType;
  }
  getPageType(): string | undefined {
    return this.manualPageType
      ? this.manualPageType
      : this._statusHandler.getDetectedPageType();
  }
  getStatus(): ScrapeStatus {
    return this._statusHandler.scrapeStatus;
  }
  async loadNewsPage(): Promise<boolean> {
    await this.scrapeMaster.goto(this.articleURL);
    if (!this.manualPageType) {
      return await this.checkLoadedNewsPage();
    }
    return true;
  }

  async checkLoadedNewsPage(): Promise<boolean> {
    let checkPage = await this.CategorizeLoadedPage();
    if (checkPage.success) {
      this._statusHandler.updateDetectedPageType(checkPage.pageType);
      if (this.elements[checkPage.pageType].undesired) {
        this._statusHandler.updateUndesiredPageError();
        return false;
      } else {
        this._statusHandler.updateSuccess();
        return true;
      }
    } else {
      this._statusHandler.updateFailedToDectectPageType();
      return false;
    }
  }

  async checkElementExist(
    elementConfig: ElementsPageTypeConfig,
  ): Promise<boolean> {
    const [eleSelector, attrName, attrValueExpect] =
      elementConfig.checkLoadedPageElement;
    const foundElements = await this.scrapeMaster.selectElements(eleSelector);
    if (foundElements.length == 0) {
      return false;
    }
    const attrToCheck = await foundElements[0].getAttribute(attrName);
    return attrToCheck == attrValueExpect;
  }

  async CategorizeLoadedPage(): Promise<PageClassification> {
    let pageCheck: PageClassification = { success: false, pageType: undefined };

    for (const [pageType, pageElements] of Object.entries(this.elements)) {
      if (pageType == 'mainArticle') {
        if (await this.checkElementExist(pageElements)) {
          // main article is the parent category
          // subsequent check can result in different pageType
          // so when a page is detected as mainArticle, it is still necessary to check other pageType
          pageCheck = { success: true, pageType: 'mainArticle' };
          // no break here
        }
      } else {
        if (await this.checkElementExist(pageElements)) {
          return { success: true, pageType: pageType };
        }
      }
    }
    return pageCheck;
  }

  getPageTypes(): string[] {
    return Object.keys(this.elements);
  }

  async extractArticleInfo(): Promise<RawArticlePage | undefined> {
    const pageType = this.getPageType();
    if (!pageType) {
      this._statusHandler.updateLoadPageError('undefined pageType');
      return;
    } else {
      const infoExtractor = this.getInfoExtractor(pageType);
      return await infoExtractor();
    }
  }
  async getOtherLinks(): Promise<OtherLinks> {
    let foundedHrefs = (await this.scrapeMaster.allTagAHrefsTexts()).map(
      ({ href }) => href,
    );
    let distinctLinks = new Set(foundedHrefs);
    let otherLinks: OtherLinks = { other: [], news: [] };
    distinctLinks.forEach((href) => {
      if (this.checkURLIsNewsPage(href, this.getPageType() as string)) {
        otherLinks.news.push(href);
      } else {
        otherLinks.other.push(href);
      }
    });
    return otherLinks;
  }
  async extractElementStatusCheck(
    cssSelector: CSSSelector,
    eleNameDebug: string,
    elementProperty: string = 'textContent',
    parentElement?: ScrapedElement,
  ): Promise<ElementExtractCheck> {
    let scrapedElement: ScrapedElement | undefined;
    try {
      scrapedElement = await this.scrapeMaster.selectElement(
        cssSelector,
        parentElement,
        eleNameDebug,
      );

      if (!scrapedElement) {
        this._statusHandler.addFieldsFailedToScrape([
          eleNameDebug,
          'undefined',
        ]);
        return { isError: true, eleHTML: undefined };
      } else {
        try {
          let propertyValue;
          if (elementProperty == 'textContent') {
            propertyValue = await scrapedElement.text();
          } else {
            propertyValue = await scrapedElement.getProperty(elementProperty);
          }
          return {
            isError: false,
            element: scrapedElement,
            propertyValue: String(propertyValue),
          };
        } catch (err) {
          this._statusHandler.addFieldsFailedToScrape([
            eleNameDebug,
            getErrorMessage(err),
          ]);

          try {
            const elementHTML = await (
              scrapedElement as ScrapedElement
            ).getOuterHTML();
            return {
              isError: true,
              element: scrapedElement,
              eleHTML: elementHTML,
            };
          } catch {
            return {
              isError: true,
              element: scrapedElement,
            };
          }
        }
      }
    } catch (err) {
      this._statusHandler.addFieldsFailedToScrape([
        eleNameDebug,
        getErrorMessage(err),
      ]);
      return { isError: true, eleHTML: undefined };
    }
  }
  async extractElementsStatusCheck(
    cssSelector: CSSSelector,
    eleNameDebug: string,
    elementProperty: string = 'textContent',
    parentElement?: ScrapedElement,
  ): Promise<ElementExtractCheck[]> {
    let elements;
    let results: ElementExtractCheck[] = [];
    try {
      elements = await this.scrapeMaster.selectElements(
        cssSelector,
        parentElement,
        eleNameDebug,
      );
    } catch (err) {
      this._statusHandler.addFieldsFailedToScrape([
        eleNameDebug,
        getErrorMessage(err),
      ]);
      return results;
    }

    for (const element of elements) {
      try {
        let propertyValue;
        if (elementProperty == 'textContent') {
          propertyValue = await element.text();
        } else {
          propertyValue = await element.getProperty(elementProperty);
        }
        results.push({
          isError: false,
          element: element,
          propertyValue: String(propertyValue),
        });
      } catch (err) {
        this._statusHandler.addFieldsFailedToScrape([
          eleNameDebug,
          getErrorMessage(err),
        ]);

        try {
          const elementHTML = await element.getOuterHTML();
          results.push({
            isError: true,
            element: element,
            eleHTML: elementHTML,
          });
        } catch {
          results.push({
            isError: true,
            element: element,
          });
        }
      }
    }

    return results;
  }
  toElementsExtractedContent(
    elementExtractCheck: ElementExtractCheck[],
  ): ElementsExtractedContent {
    let results: ElementsExtractedContent = {
      textContent: [],
      eleHTML: [],
    };
    elementExtractCheck.forEach((elementCheck) => {
      if (!elementCheck.isError) {
        results.textContent.push(elementCheck.propertyValue);
      } else if (elementCheck.eleHTML) {
        results.eleHTML.push(elementCheck.eleHTML);
      }
    });
    return results;
  }
  toElementExtractedContent(
    elementExtractCheck: ElementExtractCheck,
  ): ElementExtractedContent {
    if (!elementExtractCheck.isError) {
      return { textContent: elementExtractCheck.propertyValue };
    } else if (elementExtractCheck.eleHTML) {
      return { eleHTML: elementExtractCheck.eleHTML };
    }
    return { textContent: undefined, eleHTML: undefined };
  }
  async getDefaultRawArticlePage(): Promise<RawArticlePage> {
    return {
      url: this.scrapeMaster.currentURL(),
      page_title: await this.scrapeMaster.getPageTitle(),
      scrape_status: this.getStatus(),
      scraped_at: DateTime.now().toUTC(),
    };
  }
  async scrape(): Promise<RawArticlePage> {
    const pageIsLoaded = await this.loadNewsPage();
    if (!pageIsLoaded) {
      return await this.getDefaultRawArticlePage();
    } else {
      const pageType = this.getPageType();
      if (!pageType) {
        return await this.getDefaultRawArticlePage();
      } else {
        const extractor = this.getInfoExtractor(pageType);
        return await extractor();
      }
    }
  }
  abstract checkURLIsNewsPage(url: string, pageType: PageType): boolean;
  abstract getInfoExtractor(pageType: string): ArticleInfoExtractor;
}

export {
  ArticleAct,
  ArticleInfoExtractor,
  ElementExtractCheck,
  ElementExtractedContent,
  ElementsExtractedContent,
  OtherLinks,
  PageClassification,
};
