import { ScrapeMaster } from '../../PuppetShow/ScrapeMaster';
import {
  ElementsPageTypeConfig,
  PageType,
  TypeBaseCSSSelector,
} from '../CSSselectors';
import { RawArticlePage, ScrapeStatus, ScrapeStatusHandler } from './schemas';

type PageClassification = {
  success: boolean;
  pageType?: 'mainArticle' | string;
};
type OtherLinks = {
  other: string[];
  news: string[];
};
type ArticleInfoExtractor = () => Promise<RawArticlePage>;
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
      if (!checkPage.pageType) {
        checkPage.pageType = 'mainArticle';
      }
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
    let pageCheck: PageClassification = { success: false };

    for (const [pageType, pageElements] of Object.entries(this.elements)) {
      if (pageType == 'mainArticle') {
        if (await this.checkElementExist(pageElements)) {
          pageCheck.success = true;
          pageCheck.pageType = 'mainArticle';
        }
      } else {
        if (await this.checkElementExist(pageElements)) {
          pageCheck.pageType = pageType;
          break;
        }
      }
    }
    return pageCheck;
  }

  getPageTypes(): string[] {
    return Object.keys(this.elements);
  }

  abstract checkURLIsNewsPage(url: string, pageType: PageType): boolean;
  abstract getOtherLinks(): Promise<OtherLinks>;
  abstract getInfoExtractor(pageType: string): ArticleInfoExtractor;
  abstract extractArticleInfo(): Promise<RawArticlePage | undefined>;
  abstract scrape(): Promise<RawArticlePage>;
}

export { ArticleAct, PageClassification, OtherLinks, ArticleInfoExtractor };
