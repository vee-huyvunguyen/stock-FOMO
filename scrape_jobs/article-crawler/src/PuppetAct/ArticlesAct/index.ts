import { DateTime } from 'luxon';
import {
  ElementHTML,
  ElementTextContent,
  ScrapedElement,
} from '../../PuppetShow/ScrapedElement/index.js';
import {
  CSSSelector,
  ScrapeMaster,
} from '../../PuppetShow/ScrapeMaster/index.js';
import { getErrorMessage } from '../../utils.js';
import {
  ElementsPageTypeConfig,
  PageType,
  TypeBaseCSSSelector,
} from '../ActConfig/CSSselectors.js';
import { RawArticlePage } from './schemas.js';
import { ScrapeStatusHandler, ScrapeStatus } from './ScrapeStatusHandler.js';
import { ArticleActConfig } from '../ActConfig/index.js';

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
type ElementExtractCheck<P, T> =
  | {
      isError: false;
      element: ScrapedElement<P, T>;
      propertyValue: ElementTextContent;
    }
  | { isError: true; element: ScrapedElement<P, T>; eleHTML?: ElementHTML }
  | { isError: true; eleHTML: undefined };

type ElementExtractedContent = {
  textContent?: ElementTextContent;
  eleHTML?: ElementHTML;
};
type ElementsExtractedContent = {
  textContent: ElementTextContent[];
  eleHTML: ElementHTML[];
};
abstract class ArticleAct<P, T> {
  protected _statusHandler: ScrapeStatusHandler;
  protected elements: TypeBaseCSSSelector;
  protected undesiredURLs: string[];
  private undesiredURLsRegex: RegExp;
  private desiredURLs: RegExp;
  private skipCategoryPages?: RegExp;
  constructor(
    public scrapeMaster: ScrapeMaster<P, T>,
    public articleURL: string,
    public actConfig: ArticleActConfig,
    public manualPageType?: string,
  ) {
    this._statusHandler = ScrapeStatusHandler.new();
    if (manualPageType) {
      this._statusHandler.updateManuallyParsedPageType(manualPageType);
    }
    this.scrapeMaster = scrapeMaster;
    this.articleURL = articleURL;
    this.elements = actConfig.elements;
    this.undesiredURLs = actConfig.undesiredURLs;
    this.undesiredURLsRegex = ArticleAct.createURLsPrefixRegex(this.undesiredURLs);
    this.desiredURLs = ArticleAct.createURLsPrefixRegex(actConfig.desiredURLs);
    this.skipCategoryPages = actConfig.skipCategoryPages
      ? ArticleAct.createURLsPrefixRegex(actConfig.skipCategoryPages)
      : undefined;
    this.manualPageType = manualPageType;
  }

  checkURLIsCategoryPage(urlStr: string): boolean {
    const url = new URL(urlStr);
    // Split pathname and filter empty segments from leading/trailing slashes
    const pathSegments = url.pathname.split('/').filter((p) => p !== '');
    return pathSegments.length === 1 || (this.skipCategoryPages?.test(urlStr) ?? false);
  }

  static createURLsPrefixRegex(URLsPrefixes: string[]): RegExp {
    return new RegExp(
      `^(${URLsPrefixes.map(
        (url) => url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), // Escape regex chars
      ).join('|')})`,
    );
  }

  checkURLIsUndesired(url: string): boolean {
    if (!this.desiredURLs.test(url)) {
      return true;
    }
    if (this.undesiredURLsRegex.test(url)) {
      return true;
    }
    if (this.skipCategoryPages) {
      return this.checkURLIsCategoryPage(url);
    }
    return false;
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
    // if (this.scrapeMaster instanceof PuppetMaster) {
    // TODO: simulate human interaction on the loaded browser
    //   await this.scrapeMaster.scrollToEnd();
    // }
    if (!this.manualPageType) {
      return await this.checkLoadedNewsPage();
    }
    return true;
  }

  async checkLoadedNewsPage(): Promise<boolean> {
    const checkPage = await this.CategorizeLoadedPage();
    if (checkPage.success) {
      this._statusHandler.updateDetectedPageType(checkPage.pageType);
      if (this.elements[checkPage.pageType].undesired) {
        this._statusHandler.updateUndesiredPageError();
        return false;
      }
      this._statusHandler.updateSuccess();
      return true;
    }
    this._statusHandler.updateFailedToDectectPageType();
    return false;
  }

  async checkElementExist(
    elementConfig: ElementsPageTypeConfig,
  ): Promise<boolean> {
    for (
      const [eleSelector, attrName, attrValueExpect]
      of elementConfig.checkLoadedPageElement
    ) {
      const foundElements = await this.scrapeMaster.selectElements(eleSelector);
      if (foundElements.length === 0) {
        return false;
      }
      const attrToCheck = await foundElements[0].getProperty(attrName);
      if (attrToCheck === attrValueExpect) {
        return true;
      }
    }
    return false;
  }

  async CategorizeLoadedPage(): Promise<PageClassification> {
    let pageCheck: PageClassification = { success: false, pageType: undefined };

    for (const [pageType, pageElements] of Object.entries(this.elements)) {
      if (pageType === 'mainArticle') {
        if (await this.checkElementExist(pageElements)) {
          // main article is the parent category
          // subsequent check can result in different pageType
          // so when a page is detected as mainArticle, it is still necessary to check other pageType
          pageCheck = { success: true, pageType: 'mainArticle' };
          // no break here
        }
      } else if (await this.checkElementExist(pageElements)) {
        return { success: true, pageType };
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
      return undefined;
    }
    try {
      const infoExtractor = this.getInfoExtractor(pageType);
      return await infoExtractor();
    } catch (err) {
      return undefined;
    }
  }

  async getOtherLinks(): Promise<OtherLinks> {
    const foundHrefs = (await this.scrapeMaster.allTagAHrefsTexts()).map(
      ({ href }) => this.normalizeURL(href),
    );
    const seenUrls = new Set<string>();
    const otherLinks: Set<string> = new Set();
    const newLinks: Set<string> = new Set();

    for (const href of foundHrefs) {
      if (seenUrls.has(href)) continue;
      seenUrls.add(href);

      if (this.checkURLIsNewsPage(href, this.getPageType() as string)) {
        newLinks.add(href);
      } else {
        otherLinks.add(href);
      }
    }

    return {
      news: Array.from(newLinks),
      other: Array.from(otherLinks),
    };
  }

  async extractElementStatusCheck(
    cssSelector: CSSSelector,
    eleNameDebug: string,
    elementProperty: string = 'textContent',
    parentElement?: ScrapedElement<P, T>,
  ): Promise<ElementExtractCheck<P, T>> {
    let scrapedElement: ScrapedElement<P, T> | undefined;
    try {
      scrapedElement = await this.scrapeMaster.selectElement(
        cssSelector,
        parentElement,
        eleNameDebug,
      );

      if (!scrapedElement) {
        this._statusHandler.addFieldsFailedToScrape([
          eleNameDebug,
          `wrong selector: ${cssSelector}`,
        ]);
        return { isError: true, eleHTML: undefined };
      }
      try {
        let propertyValue;
        if (elementProperty === 'textContent') {
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
    parentElement?: ScrapedElement<P, T>,
  ): Promise<ElementExtractCheck<P, T>[]> {
    let elements;
    const results: ElementExtractCheck<P, T>[] = [];
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
    if (elements.length === 0) {
      this._statusHandler.addFieldsFailedToScrape([
        eleNameDebug,
        'no elements found',
      ]);
      return results;
    }
    for (const element of elements) {
      try {
        let propertyValue;
        if (elementProperty === 'textContent') {
          propertyValue = await element.text();
        } else {
          propertyValue = await element.getProperty(elementProperty);
        }
        results.push({
          isError: false,
          element,
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
            element,
            eleHTML: elementHTML,
          });
        } catch {
          results.push({
            isError: true,
            element,
          });
        }
      }
    }

    return results;
  }

  toElementsExtractedContent(
    elementExtractCheck: ElementExtractCheck<P, T>[],
  ): ElementsExtractedContent {
    const results: ElementsExtractedContent = {
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
    elementExtractCheck: ElementExtractCheck<P, T>,
  ): ElementExtractedContent {
    if (!elementExtractCheck.isError) {
      return { textContent: elementExtractCheck.propertyValue };
    } if (elementExtractCheck.eleHTML) {
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
    }
    const pageType = this.getPageType();
    if (!pageType) {
      return await this.getDefaultRawArticlePage();
    }
    const extractor = this.getInfoExtractor(pageType);
    return await extractor();
  }

  async scrapeLandingPage(): Promise<RawArticlePage> {
    const pageIsLoaded = await this.loadNewsPage();
    let foundLinks: OtherLinks = {
      other: [],
      news: [],
    };
    if (pageIsLoaded) {
      foundLinks = await this.getOtherLinks();
      this._statusHandler.updatePageType('landingPage', 'manuallyParsed');
    } else {
      this._statusHandler.updateLoadPageError('landingPage');
    }
    return {
      ...(await this.getDefaultRawArticlePage()),
      other_links: foundLinks?.other,
      other_article_links: foundLinks?.news,
    };
  }

  /**
   * Normalize URL by removing query params/hashes
   */
  normalizeURL(url: string): string {
    // Normalize URLs by stripping query params and hash fragments
    return url.split(/[?#]/)[0];
  }

  async extractArticleCommonElement(
    cssSelectorKey: CSSSelector,
    fieldNameDebug: string,
    manyElements: true,
    elementProperty?: string
  ): Promise<ElementsExtractedContent>;

  async extractArticleCommonElement(
    cssSelectorKey: CSSSelector,
    fieldNameDebug: string,
    manyElements: false,
    elementProperty?: string
  ): Promise<ElementExtractedContent>;

  async extractArticleCommonElement(
    cssSelectorKey: CSSSelector,
    fieldNameDebug: string,
    manyElements: boolean,
    elementProperty?: string,
  ): Promise<ElementExtractedContent | ElementsExtractedContent> {
    if (!elementProperty) {
      elementProperty = 'textContent';
    }
    const cssSelectors = this.elements[this.getPageType() as string];
    if (manyElements) {
      const elementsExtractCheck = await this.extractElementsStatusCheck(
        cssSelectors[cssSelectorKey] as CSSSelector,
        fieldNameDebug,
        elementProperty,
      );
      return this.toElementsExtractedContent(elementsExtractCheck);
    }
    return this.toElementExtractedContent(
      await this.extractElementStatusCheck(
        cssSelectors[cssSelectorKey] as CSSSelector,
        fieldNameDebug,
        elementProperty,
      ),
    );
  }

  commonArticleExtractor = async (
    fieldToIgnore?: (keyof RawArticlePage)[],
  ): Promise<RawArticlePage> => {
    if (!fieldToIgnore) {
      fieldToIgnore = [];
    }
    const otherLinks: OtherLinks = await this.getOtherLinks();
    const baseRawArticlePage = {
      ...(await this.getDefaultRawArticlePage()),
      other_article_links: otherLinks.news,
      other_links: otherLinks.other,
    };
    if (!fieldToIgnore.includes('content')) {
      const content = await this.extractArticleCommonElement(
        'contentElements',
        'MainArticle-article-content',
        true,
      );
      baseRawArticlePage.content_elements = content.eleHTML;
      baseRawArticlePage.content = content.textContent;
    }
    if (!fieldToIgnore.includes('authors')) {
      const authors = await this.extractArticleCommonElement(
        'authorElements',
        'MainArticle-author-info',
        true,
        'href',
      );
      baseRawArticlePage.author_elements = authors.eleHTML;
      baseRawArticlePage.authors = authors.textContent;
    }
    if (!fieldToIgnore.includes('article_published_datetime')) {
      const publishedDatetime = await this.extractArticleCommonElement(
        'postDatetimeElement',
        'MainArticle-post-datetime',
        false,
      );
      baseRawArticlePage.article_published_datetime_element = publishedDatetime.eleHTML;
      baseRawArticlePage.article_published_datetime = publishedDatetime.textContent;
    }
    if (!fieldToIgnore.includes('article_updated_datetime')) {
      const updatedDatetime = await this.extractArticleCommonElement(
        'updatedDatetimeElement',
        'MainArticle-updated-datetime',
        false,
      );
      baseRawArticlePage.article_updated_datetime_element = updatedDatetime.eleHTML;
      baseRawArticlePage.article_updated_datetime = updatedDatetime.textContent;
    }
    if (!fieldToIgnore.includes('article_title')) {
      const title = await this.extractArticleCommonElement(
        'articleTitleElement',
        'MainArticle-title',
        false,
      );
      baseRawArticlePage.article_title_element = title.eleHTML;
      baseRawArticlePage.article_title = title.textContent;
    }
    if (!fieldToIgnore.includes('category')) {
      const category = await this.extractArticleCommonElement(
        'categoryElement',
        'MainArticle-category',
        false,
        'href',
      );
      baseRawArticlePage.category_element = category.eleHTML;
      baseRawArticlePage.category = category.textContent;
    }
    if (this.elements[this.getPageType() as string].tagElements) {
      const tags = await this.extractArticleCommonElement(
        'tagElements',
        'MainArticle-tags',
        true,
        'href',
      );
      baseRawArticlePage.tag_elements = tags.eleHTML;
      baseRawArticlePage.tags = tags.textContent;
    }
    return baseRawArticlePage;
  };

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
