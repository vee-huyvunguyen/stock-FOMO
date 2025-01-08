import { eq, range } from 'lodash';
import { ActResult, ArticleAct, LoadedPageCheck } from '.';
import { ScrapeMaster } from '../../PuppetShow/ScrapeMaster';
import { getErrorMessage } from '../../utils';
import { ScrapeStatus, RawNewsPage } from './schemas';

class CNBCAct implements ArticleAct {
  scrapeStatus: ScrapeStatus;
  constructor(
    public scrapeMaster: ScrapeMaster,
    public articleURL: string,
    public loadPageCheckLoopLimit: number,
    public elements: TypeCNBCActCSSselector,
    public pageType?: string,
  ) {
    this.scrapeMaster = scrapeMaster;
    this.articleURL = articleURL;
    this.loadPageCheckLoopLimit = loadPageCheckLoopLimit;
    this.scrapeStatus = { success: true, reloadPageCount: 0 };
    this.elements = elements
    this.pageType = pageType;
  }
  updateStatusLoadPageFail(
    addLoadPageErr: unknown,
    addFieldsFailedToScrape?: [string, string][],
  ) {
    this.scrapeStatus.success = false;
    let currentError = this.scrapeStatus.failReport?.loadPageError;
    let fieldsFailedToScrape =
      this.scrapeStatus.failReport?.fieldsFailedToScrape;
    if (addFieldsFailedToScrape) {
      fieldsFailedToScrape = fieldsFailedToScrape
        ? fieldsFailedToScrape.concat(addFieldsFailedToScrape)
        : fieldsFailedToScrape;
    }
    this.scrapeStatus.failReport = {
      failStep: 'load-page',
      loadPageError: addLoadPageErr
        ? `${currentError}\n${getErrorMessage(addLoadPageErr)}`
        : currentError,
      fieldsFailedToScrape,
    };
  }
  async loadNewsPage(): Promise<boolean> {
    try {
      await this.scrapeMaster.goto(this.articleURL);
    } catch (err) {
      this.updateStatusLoadPageFail(err);
      return false;
    }
    return true;
  }
  async loadNewsPageCheckLoop(): Promise<boolean> {
    let checkPage: LoadedPageCheck = { success: true };
    for (const checkIdx of range(1, this.loadPageCheckLoopLimit + 1)) {
      let status = await this.loadNewsPage();
      if (!status) {
        this.updateStatusLoadPageFail(
          `Retried loading page for ${checkIdx} times`,
        );
        return false;
      }
      checkPage = await this.checkLoadedPage();
      if (!checkPage.success) {
        if (checkIdx == this.loadPageCheckLoopLimit) {
          var fieldsFailed = checkPage.missingElement;
          this.updateStatusLoadPageFail(
            `Loaded Page is not Valid: missing Element ${fieldsFailed?.elementName}`,
            [
              [
                fieldsFailed?.elementName as string,
                fieldsFailed?.html as string,
              ],
            ],
          );
          return false;
        }
        this.scrapeStatus.reloadPageCount += 1;
      }
    }
    return true;
  }
  async checkLoadedPage(): Promise<LoadedPageCheck> {
    Object.entries(this.elements).forEach(([pageType, pageElements])=>{
      
    })
  }
  getPageTypes(): string[] {
    return Object.keys(this.elements)
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
