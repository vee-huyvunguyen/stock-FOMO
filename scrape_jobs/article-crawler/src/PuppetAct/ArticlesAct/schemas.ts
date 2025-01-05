import { DateTime } from 'luxon';

interface RawNewsPage {
  id: number;
  url: string;
  content_elements: string[];
  author_element: string;
  post_datetime_element: string;
  category_element: string;
  content: string[];
  author: string;
  post_datetime: DateTime;
  category: string;
  other_info: Record<
    string,
    string | number | boolean | Array<string | number | boolean>
  >;
  scrape_status: string;
  scraped_at: DateTime;
  inserted_at: DateTime;
}

export { RawNewsPage };
