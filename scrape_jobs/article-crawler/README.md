## Crawler for News and Articles
- Reference: https://pptr.dev/
- Articles site that will be scraped: CNBC, Reuters, Fox News

## For downstream validation:
- Cases when scraping a page is not successful, but information is till valuable (need not re-scrape):
    - In Live CNBC updates, there aren't category and published datetime. E.g.: https://www.cnbc.com/2025/02/03/stock-market-today-live-updates.html
    - Either updated or publied datetime is not present. E.g.:https://www.cnbc.com/2025/01/28/tech-worker-saved-up-to-90-percent-of-his-pay-and-retired-with-3point5-million-dollars.html