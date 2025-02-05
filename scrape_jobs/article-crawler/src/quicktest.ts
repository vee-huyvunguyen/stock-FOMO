import puppeteer from 'puppeteer';
import PuppetMaster from '@/PuppetShow/ScrapeMaster/PuppetMaster';
import ConsoleWatcher from '@/PuppetShow/TheWatcher/ConsoleWatcher';
import CheerioMaster from '@/PuppetShow/ScrapeMaster/CheerioMaster';
import CNBCAct from '@/PuppetAct/ArticlesAct/CNBCAct';
import { CNBCActCSSselector } from '@/PuppetAct/CSSselectors';

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
  return puppetMaster;
}

async function getCheerioMaster(url: string) {
  const watcher = new ConsoleWatcher({ level: 'warn' });
  const page = await CheerioMaster.loadCheerioAPI(url);
  return new CheerioMaster({ logNullElement: false }, page, watcher, url);
}

async function main() {
  const url: string = 'https://www.cnbc.com/2025/02/05/novo-nordisk-nvo-earnings-q4-full-year-fy24.html';
  // let master = await getCheerioMaster(url)
  let master = await getPuppetMaster();
  let cnbcAct = new CNBCAct(master, url, CNBCActCSSselector);
  try {
    let article = await cnbcAct.scrape();
    console.log(article);
  } finally {
    console.log(cnbcAct.getStatus());
    await master.close();
  }
  // Close the browser
}

// Example usage
main();
