import puppeteer from 'puppeteer';

async function scrapeUrl(url: string) {
  // Launch a headless browser
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Navigate to the URL
  await page.goto(url, { waitUntil: 'networkidle2' });

  // Wait for a specific element to be loaded
  // Replace 'body' with the actual selector of an element that indicates the page is fully loaded
  await page.waitForSelector('body');

  // Scrape the content
  const content = await page.evaluate(() => {
    // Replace 'body' with the actual element or content you want to scrape
    return document.querySelector('body')?.innerHTML || '';
  });

  // Close the browser
  await browser.close();

  return content;
}

// Example usage
(async () => {
  const url = 'https://example.com';
  const content = await scrapeUrl(url);
  console.log(content);
})();