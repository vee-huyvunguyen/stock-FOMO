import { DateTime } from 'luxon';

type FieldName = string;
type FieldError = string;

type ScrapeStatus = {
  success: boolean;
  reloadPageCount: number;
  failReport?: {
    failStep: 'load-page' | 'scrape-element';
    loadPageError?: string;
    fieldsFailedToScrape?: [FieldName, FieldError][];
  };
};

type RawNewsPage = {
  url: string;
  content_elements: string[];
  author_element: string;
  post_datetime_element: string;
  category_element: string;
  content: string[];
  author: string;
  post_datetime: DateTime;
  category: string;
  other_news_links: string[];
  other_links: string[];
  scrape_status: ScrapeStatus;
  scraped_at: DateTime;
  inserted_at: DateTime;
};

export { RawNewsPage, ScrapeStatus };
