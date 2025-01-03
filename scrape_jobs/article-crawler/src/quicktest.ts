import puppeteer from 'puppeteer';
import PuppetMaster from './PuppetShow/TheMaster/PuppetMaster';
import ConsoleWatcher from './PuppetShow/TheWatcher/ConsoleWatcher';
import CheerioMaster from './PuppetShow/TheMaster/CheerioMaster';

async function getPuppetMaster(): Promise<PuppetMaster> {
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
  return puppetMaster
}

async function getCheerioMaster(url: string) {
  const watcher = new ConsoleWatcher({ level: 'warn' });
  const page = await CheerioMaster.loadCheerioAPI(url);
  return new CheerioMaster({ logNullElement: false }, page, watcher, url)
}


async function main() {
  const url: string = 'https://quotes.toscrape.com/';
  // let master = await getCheerioMaster(url)
  let master = await getPuppetMaster()

  try {
    await master.goto(url);
    const titleElement = await master.selectElement(
      'div.quote:nth-child(1) > span:nth-child(1)',
    );
    const innerHTML = await titleElement?.getOuterHTML();
    console.log(`first qoute's outerHTML is ${innerHTML}`);
  } finally {
    await master.close();
  }
  // Close the browser
}

// Example usage
main();
