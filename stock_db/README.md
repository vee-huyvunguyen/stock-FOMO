## Data warehouse design
3 schemas
- `scrape`: to store raw scraped data, and cache scrape progress 
    - `raw_news_pages`: scraped pages and their elements.
    - `scraped_links`: links, and their last scraped datetime (with tz)
    - `pending_pages_to_scrape`: store the pages to be scraped, will be read by scraping jobs, and update them to be scraped.
- `analytics`: to store analysis, ready to be served to dashboard
    - `news_polarity_towards_stocks`
- `news_entity`: to store data models that represent
    - `company`(stock)
    - `industry`
    - `news_source` (websites)
    - `grouped_news_categories`
    - `raw_news_categories`
    - `news` (websites)
    - `author`
    - `words_polarity_weight`: processed words/compound words, and their weights towards a polarity (positive, negative, neutral)