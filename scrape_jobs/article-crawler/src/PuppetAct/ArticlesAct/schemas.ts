import { DateTime } from 'luxon';
import { ScrapeStatus } from '@/PuppetAct/ArticlesAct/ScrapeStatusHandler';

type RawArticlePage = {
  url: string;
  pageTitle: string;
  content_elements?: string[];
  author_element?: string;
  post_datetime_element?: string;
  category_element?: string;
  content?: string[];
  author?: string;
  post_datetime?: string;
  category?: string;
  other_article_links?: string[];
  other_links?: string[];
  scrape_status: ScrapeStatus;
  scraped_at: DateTime;
  // inserted_at: DateTime; //Meant to be in the database
};

export { RawArticlePage };
