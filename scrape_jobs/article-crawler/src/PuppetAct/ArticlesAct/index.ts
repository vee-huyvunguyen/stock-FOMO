import { ScrapeMaster } from '../../PuppetShow/ScrapeMaster';
import { RawNewsPage, ScrapeStatus, ScrapeStatusHandler } from './schemas';

type LoadedPageCheck = {
  success: boolean;
  pageType?: 'mainArticle' | string;
};

abstract class ArticleAct {
  protected _statusHandler: ScrapeStatusHandler;

  constructor(
    public scrapeMaster: ScrapeMaster,
    public articleURL: string,
    public elements: TypeBaseCSSSelector,
    public pageType?: string,
  ) {
    this._statusHandler = ScrapeStatusHandler.new();
  }
  getStatus(): ScrapeStatus {
    return this._statusHandler.scrapeStatus;
  }
  async loadNewsPage(): Promise<boolean> {
    await this.scrapeMaster.goto(this.articleURL);
    return true;
  }

  async loadNewsPageCheck(): Promise<boolean> {
    await this.loadNewsPage();

    let checkPage = await this.checkLoadedPage();
    if (checkPage.success) {
      if (!checkPage.pageType) {
        checkPage.pageType = 'mainArticle';
      }
      this._statusHandler.updatePageType(checkPage.pageType);
      if (this.elements[checkPage.pageType].undesired) {
        this._statusHandler.updateUndesiredPageError();
        return false;
      } else {
        this._statusHandler.updateSuccess(checkPage.pageType);
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

  async checkLoadedPage(): Promise<LoadedPageCheck> {
    let pageCheck: LoadedPageCheck = { success: false };

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

  abstract checkIsNewsPage(): Promise<boolean>;
  abstract getOtherNewsLinks(): string[];
  abstract getOtherLinks(): string[];
  abstract getNewsInfo(): Promise<RawNewsPage>;
  abstract scrape(): Promise<RawNewsPage>;
}

export { ArticleAct, LoadedPageCheck };
