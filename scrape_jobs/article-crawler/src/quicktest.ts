import puppeteer from 'puppeteer';
import PuppetMaster from '@/PuppetShow/ScrapeMaster/PuppetMaster';
import ConsoleWatcher from '@/PuppetShow/TheWatcher/ConsoleWatcher';
import CheerioMaster from '@/PuppetShow/ScrapeMaster/CheerioMaster';
import CNBCAct from '@/PuppetAct/ArticlesAct/CNBCAct';
import { CNBCActCSSselector, FoxNewsActCSSselector } from '@/PuppetAct/ActConfig/CSSselectors';
import { CNBC_UNDESIRED_URLS, FOXNEWS_UNDESIRED_URLS } from '@/PuppetAct/ActConfig/UndesiredURLs';
import FoxNewsAct from '@/PuppetAct/ArticlesAct/FoxNewsAct';

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
        timeout: 300000,
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
  const CNBCUrlsTests: string[] = [
    'https://www.cnbc.com/2025/02/05/novo-nordisk-nvo-earnings-q4-full-year-fy24.html',
    'https://www.cnbc.com/2025/02/03/stock-market-today-live-updates.html',
    'https://www.cnbc.com/2025/01/28/tech-worker-saved-up-to-90-percent-of-his-pay-and-retired-with-3point5-million-dollars.html',
    'https://www.cnbc.com/select/best-mortgage-lenders-first-time-homebuyers/',
    // 'https://www.cnbc.com'
  ];
  const FoxNewsUrlsTests: string[] = [
    // 'https://www.foxnews.com/us/4-fema-employees-fired-over-egregious-payments-migrants-dhs-says',
    // 'https://www.foxbusiness.com/media/jon-taffer-schools-democrat-leader-pointing-fingers-trump-over-rising-prices',
    'https://www.outkick.com/culture/rachel-stuhlmann-slides-pink-tennis-outfit-valentines-day-eagles-fans-fighting-baja-blast-pie',
    // 'https://www.foxweather.com/weather-news/saturday-sunday-storm-snow-rain-severe-midwest-northeast-southeast'
  ]
  let master = await getPuppetMaster();
  for (const url of FoxNewsUrlsTests) {
    let foxNewsAct = new FoxNewsAct(master, url, {
      elements: FoxNewsActCSSselector,
      undesiredURLs: FOXNEWS_UNDESIRED_URLS
    });
    try {
      console.log("_______________________");
      await foxNewsAct.scrape();
      // console.log(result);
    } finally {
      console.log(JSON.stringify(foxNewsAct.getStatus()));
      console.log("\n");
    }
  }
  // Close the browser
  await master.close();
}

// Example usage
main();
