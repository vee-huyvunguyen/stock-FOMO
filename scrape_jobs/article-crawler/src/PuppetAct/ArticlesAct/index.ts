import { ScrapeMaster } from '../../PuppetShow/ScrapeMaster';
import { RawNewsPage, ScrapeStatusHandler } from './schemas';

type ActResult = {
  rawNewsPage: RawNewsPage;
  otherNewsLinks: string[];
};

type LoadedPageCheck = {
  success: boolean;
  pageType?: 'mainArticle' | string;
};

interface ArticleAct {
  scrapeMaster: ScrapeMaster;
  articleURL: string;
  statusHandler: ScrapeStatusHandler;
  pageType?: string;
  elements: any;
  loadNewsPage(): Promise<boolean>;
  checkLoadedPage(): Promise<LoadedPageCheck>;

  checkIsNewsPage(): Promise<boolean>;
  getOtherNewsLinks(): string[];
  getOtherLinks(): string[];

  getNewsInfo(): Promise<RawNewsPage>;
  scrape(): Promise<ActResult>;
}

export { ArticleAct, ActResult, LoadedPageCheck };
