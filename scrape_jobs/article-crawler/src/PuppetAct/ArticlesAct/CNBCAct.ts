import { ActResult, ArticleAct, LoadedPageCheck } from '.';
import { ScrapeMaster } from '../../PuppetShow/ScrapeMaster';
import { RawNewsPage, ScrapeStatusHandler } from './schemas';

class CNBCAct implements ArticleAct {
  statusHandler: ScrapeStatusHandler;
  constructor(
    public scrapeMaster: ScrapeMaster,
    public articleURL: string,
    public elements: TypeCNBCActCSSselector,
    public pageType?: string,
  ) {
    this.scrapeMaster = scrapeMaster;
    this.articleURL = articleURL;
    this.statusHandler = ScrapeStatusHandler.new();
    this.elements = elements;
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
      this.statusHandler.updatePageType(checkPage.pageType);
      if (this.elements[checkPage.pageType].undesired) {
        this.statusHandler.updateUndesiredPageError();
        return false;
      } else {
        this.statusHandler.updateSuccess(checkPage.pageType);
        return true;
      }
    } else {
      this.statusHandler.updateFailedToDectectPageType();
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
  async checkIsNewsPage(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  getOtherNewsLinks(): string[] {
    throw new Error('Method not implemented.');
  }
  getOtherLinks(): string[] {
    throw new Error('Method not implemented.');
  }
  async getNewsInfo(): Promise<RawNewsPage> {
    throw new Error('Method not implemented.');
  }
  async scrape(): Promise<ActResult> {
    throw new Error('Method not implemented.');
  }
}

export default CNBCAct;
