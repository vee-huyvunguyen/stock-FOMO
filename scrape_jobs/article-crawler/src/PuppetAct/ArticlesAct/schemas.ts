import { DateTime } from 'luxon';
import { ScrapeStatus } from '@/PuppetAct/ArticlesAct/ScrapeStatusHandler';

type RawArticlePage = {
  url: string;
  pageTitle: string;
  article_title_element?: string;
  content_elements?: string[];
  author_elements?: string[];
  article_published_datetime_element?: string;
  article_updated_datetime_element?: string;
  category_element?: string;
  article_title?: string;
  content?: string[];
  author?: string[];
  article_published_datetime?: string;
  article_updated_datetime?: string;
  category?: string;
  other_article_links?: string[];
  other_links?: string[];
  scrape_status: ScrapeStatus;
  scraped_at: DateTime;
  // inserted_at: DateTime; //Meant to be in the database
};

export { RawArticlePage };
