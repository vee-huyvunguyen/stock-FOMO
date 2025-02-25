# News Article Scraper

Web scraper for extracting structured article data from news websites (currently supports Fox News and CNBC).

## Features

- Handles different article page types (main, business, weather)
- Filters undesired URLs/category pages
- Extracts article content, metadata, and related links
- Built with Apify Platform and Puppeteer

## Input Format

```json
{
  "urls": [
    { "url": "https://www.foxnews.com/politics", "site": "foxnews" },
    { "url": "https://www.cnbc.com/technology", "site": "cnbc" }
  ],
  "maxPages": 100,
  "skippingCategoryPages": true
}
```

## Output Schema
Extracted data structure:
```typescript
type RawArticlePage = {
  url: string;
  page_title: string;
  article_title_element?: string;
  content_elements?: string[];
  author_elements?: string[];
  article_published_datetime_element?: string;
  article_updated_datetime_element?: string;
  tag_elements?: string[];
  tags?: string[];
  category_element?: string;
  article_title?: string;
  content?: string[];
  authors?: string[];
  article_published_datetime?: string;
  article_updated_datetime?: string;
  category?: string;
  other_article_links?: string[];
  other_links?: string[];
  scrape_status: ScrapeStatus;
  scraped_at: DateTime;
};
```