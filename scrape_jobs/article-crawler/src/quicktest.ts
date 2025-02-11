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
    {
      logNullElement: false,
      defaultGotoOptions: {
        timeout: 30000,
        waitUntil: 'networkidle0',
      },
    },
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
  const urls: string[] = [
    // 'https://www.cnbc.com/2025/02/05/novo-nordisk-nvo-earnings-q4-full-year-fy24.html',
    // 'https://www.cnbc.com/2025/02/03/stock-market-today-live-updates.html',
    // 'https://www.cnbc.com/2025/01/28/tech-worker-saved-up-to-90-percent-of-his-pay-and-retired-with-3point5-million-dollars.html',
    // 'https://www.cnbc.com/select/best-mortgage-lenders-first-time-homebuyers/',
    // 'https://www.cnbc.com/2025/02/04/mondays-turnaround-showed-little-guy-continues-to-drive-bull-market.html'
    'https://www.cnbc.com'
  ];
  // let master = await getCheerioMaster(url)
  let master = await getPuppetMaster();
  for (const url of urls) {
    let cnbcAct = new CNBCAct(master, url, CNBCActCSSselector);
    try {
      let result = await cnbcAct.scrapeLandingPage();
      console.log(result);
    } finally {
      console.log(JSON.stringify(cnbcAct.getStatus()));
    }
  }
  // Close the browser
  await master.close();
}

// Example usage
main();
