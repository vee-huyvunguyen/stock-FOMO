## Crawler for News and Articles
- Reference: https://pptr.dev/
- Articles site that will be scraped: CNBC, Reuters, Fox News

## For downstream validation:
- Cases when scraping a page is not successful, but information is till valuable (need not re-scrape):
    - In Live CNBC updates, there aren't category and published datetime. E.g.: https://www.cnbc.com/2025/02/03/stock-market-today-live-updates.html
    - Either updated or publied datetime is not present. E.g.:https://www.cnbc.com/2025/01/28/tech-worker-saved-up-to-90-percent-of-his-pay-and-retired-with-3point5-million-dollars.html
- Some pages are meant for navigation, containing links to other articles, bot not any news content.
    - Currently using the scrapeLandingPage() method to scrape these pages.
    - These pages have special urls -> can be filtered later

## Guide
- *Note*: On Linux, please run this command to install chromedriver's dependencies:
    ```
    sudo apt-get update && sudo apt-get install -y \
        libnss3 \
        libatk1.0-0 \
        libatk-bridge2.0-0 \
        libx11-xcb1 \
        libxcomposite1 \
        libxdamage1 \
        libxfixes3 \
        libxkbcommon0 \
        libxrandr2 \
        libgbm-dev \
        libgtk-3-0 \
        libdrm2 \
        libasound2t64
    ```
- For first time setup, run `pnpm install`
- Then run `pnpm approve-builds`, a prompt will show up, please approve the all builds.
- Then run `pnpm quicktest` to check installed chromedriver and quick scrape of a landing page.
    - *Note*: If puppeteer still not recognizes the chromedriver, try running:
        - `pnpm dlx puppeteer browsers install chrome@131.0.6778.204 --path ./.cache/puppeteer` 