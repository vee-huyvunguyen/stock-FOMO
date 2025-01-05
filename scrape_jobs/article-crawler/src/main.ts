import puppeteer from 'puppeteer';
import PuppetMaster from './PuppetShow/ScrapeMaster/PuppetMaster';
import ConsoleWatcher from './PuppetShow/TheWatcher/ConsoleWatcher';

async function main() {
  const url: string = 'https://quotes.toscrape.com/';

  // Launch a headless browser
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const watcher = new ConsoleWatcher({ level: 'warn' });
  var puppetMaster = new PuppetMaster(
    page,
    browser,
    { logNullElement: false },
    watcher,
  );

  try {
    await puppetMaster.goto(url);
    const titleElement = await puppetMaster.selectElement(
      'div.quote:nth-child(1) > span:nth-child(1)',
    );
    const title = await titleElement?.text();
    console.log(`first qoute is ${title}`);
  } finally {
    await browser.close();
  }
  // Close the browser
}

// Example usage
main();
