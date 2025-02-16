import puppeteer from 'puppeteer';
import PuppetMaster from '@/PuppetShow/ScrapeMaster/PuppetMaster';
import ConsoleWatcher from '@/PuppetShow/TheWatcher/ConsoleWatcher';
import CheerioMaster from '@/PuppetShow/ScrapeMaster/CheerioMaster';
import CNBCAct from '@/PuppetAct/ArticlesAct/CNBCAct';
import {
  CNBCActCSSselector,
  FoxNewsActCSSselector,
} from '@/PuppetAct/ActConfig/CSSselectors';
import {
  CNBC_UNDESIRED_URLS,
  FOXNEWS_UNDESIRED_URLS,
} from '@/PuppetAct/ActConfig/UndesiredURLs';
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
        // Take care of the waitUntil option
        // Some pages take forever to load,
        // so we choose a more loose option: 'domcontentloaded' or 'load'
        waitUntil: 'domcontentloaded',
      },
    },
    watcher,
  );
  return puppetMaster;
}

async function getCheerioMaster() {
  const watcher = new ConsoleWatcher({ level: 'warn' });
  return new CheerioMaster({ logNullElement: false }, watcher);
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
    'https://www.foxnews.com/us/4-fema-employees-fired-over-egregious-payments-migrants-dhs-says',
    'https://www.foxbusiness.com/media/jon-taffer-schools-democrat-leader-pointing-fingers-trump-over-rising-prices',
    'https://www.outkick.com/analysis/elon-musk-faces-free-speech-conundrum-kanye-west-bobby-burack',
    'https://www.foxweather.com/weather-news/saturday-sunday-storm-snow-rain-severe-midwest-northeast-southeast',
  ];
  let master = await getPuppetMaster();
  for (const url of FoxNewsUrlsTests) {
    // for (const url of CNBCUrlsTests) {
    const startTime = Date.now();
    let act = new FoxNewsAct(master, url, {
      elements: FoxNewsActCSSselector,
      undesiredURLs: FOXNEWS_UNDESIRED_URLS,
    });
    // let act = new CNBCAct(master, url, {
    //   elements: CNBCActCSSselector,
    //   undesiredURLs: CNBC_UNDESIRED_URLS,
    // });
    try {
      console.log('_______________________');
      const result = await act.scrape();
      // console.log(result);
    } finally {
      console.log(JSON.stringify(act.getStatus()));
      const endTime = Date.now();
      const duration = endTime - startTime;
      console.log(`Time taken: ${duration}ms`);
      console.log('\n');
    }
  }
  // Close the browser
  await master.close();
}

// Example usage
main();
