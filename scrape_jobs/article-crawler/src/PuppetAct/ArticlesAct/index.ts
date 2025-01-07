import { ScrapeMaster } from '../../PuppetShow/ScrapeMaster';
import { RawNewsPage, ScrapeStatus } from './schemas';

type ActResult = {
  rawNewsPage: RawNewsPage;
  otherNewsLinks: string[];
};

type LoadedPageCheck = {
  success: boolean;
  missingElement?: {
    html: string;
    elementName: string;
  };
};

interface ArticleAct {
  scrapeMaster: ScrapeMaster;
  articleURL: string;
  scrapeStatus: ScrapeStatus;
  loadPageCheckLoopLimit: number; // integer
  loadNewsPage(): Promise<boolean>;
  checkLoadedPage(): Promise<LoadedPageCheck>;

  checkIsNewsPage(): Promise<boolean>;
  getOtherNewsLinks(): string[];
  getOtherLinks(): string[];

  getNewsInfo(): Promise<RawNewsPage>;
  scrape(): Promise<ActResult>;
}

export { ArticleAct, ActResult, LoadedPageCheck };
