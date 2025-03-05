import puppeteer from 'puppeteer';
import PuppetMaster from './PuppetShow/ScrapeMaster/PuppetMaster.js';
import ConsoleWatcher from './PuppetShow/TheWatcher/ConsoleWatcher.js';
import CNBCAct from './PuppetAct/ArticlesAct/CNBCAct/index.js';
import {
  CNBCActCSSselector,
  FoxNewsActCSSselector,
} from './PuppetAct/ActConfig/CSSselectors.js';
import {
  CNBC_UNDESIRED_URLS,
  FOXNEWS_UNDESIRED_URLS,
} from './PuppetAct/ActConfig/UndesiredURLs.js';
import FoxNewsAct from './PuppetAct/ArticlesAct/FoxNewsAct/index.js';
import { ScrapeMaster } from './PuppetShow/ScrapeMaster/index.js';
import { CNBC_DESIRED_URLS, FOXNEWS_DESIRED_URLS } from './PuppetAct/ActConfig/DesiredURLs.js';
import { CNBC_CATEGORY_URLS, FOXNEWS_CATEGORY_URLS } from './PuppetAct/ActConfig/CategoryURLS.js';

async function getPuppetMaster(): Promise<PuppetMaster> {
  // Launch a headless browser
  const browser = await puppeteer.launch({
    headless: false, // Make browser visible
    slowMo: 100, // Slow down operations by 100ms for better visibility
    defaultViewport: {
      width: 1280,
      height: 800,
    },
  });
  const page = await browser.newPage();
  const watcher = new ConsoleWatcher({ level: 'warn' });
  const puppetMaster = new PuppetMaster(
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

async function testFoxNewsAct<P, T>(scrapeMaster: ScrapeMaster<P, T>) {
  const FoxNewsUrlsTests: string[] = [
    'https://www.foxnews.com/us/4-fema-employees-fired-over-egregious-payments-migrants-dhs-says',
    'https://www.foxbusiness.com/media/jon-taffer-schools-democrat-leader-pointing-fingers-trump-over-rising-prices',
    'https://www.outkick.com/analysis/elon-musk-faces-free-speech-conundrum-kanye-west-bobby-burack',
    'https://www.foxweather.com/weather-news/saturday-sunday-storm-snow-rain-severe-midwest-northeast-southeast',
  ];
  for (const url of FoxNewsUrlsTests) {
    const startTime = Date.now();
    const act = new FoxNewsAct(scrapeMaster, url, {
      elements: FoxNewsActCSSselector,
      undesiredURLs: FOXNEWS_UNDESIRED_URLS,
      desiredURLs: FOXNEWS_DESIRED_URLS,
      skipCategoryPages: FOXNEWS_CATEGORY_URLS,
    });
    try {
      console.log('_______________________');
      const result = await act.scrape();
      console.log(result);
    } finally {
      console.log(JSON.stringify(act.getStatus()));
      const endTime = Date.now();
      const duration = endTime - startTime;
      console.log(`Time taken: ${duration}ms`);
      console.log('\n');
    }
  }
}

async function testCNBCAct<P, T>(scrapeMaster: ScrapeMaster<P, T>) {
  const CNBCUrlsTests: string[] = [
    'https://www.cnbc.com/2025/02/05/novo-nordisk-nvo-earnings-q4-full-year-fy24.html',
    'https://www.cnbc.com/2025/02/03/stock-market-today-live-updates.html',
    'https://www.cnbc.com/2025/01/28/tech-worker-saved-up-to-90-percent-of-his-pay-and-retired-with-3point5-million-dollars.html',
    'https://www.cnbc.com/select/best-mortgage-lenders-first-time-homebuyers/',
    // 'https://www.cnbc.com'
  ];
  for (const url of CNBCUrlsTests) {
    // for (const url of CNBCUrlsTests) {
    const startTime = Date.now();
    const act = new CNBCAct(scrapeMaster, url, {
      elements: CNBCActCSSselector,
      undesiredURLs: CNBC_UNDESIRED_URLS,
      desiredURLs: CNBC_DESIRED_URLS,
      skipCategoryPages: CNBC_CATEGORY_URLS,
    });
    try {
      console.log('_______________________');
      const result = await act.scrape();
      console.log(result);
    } finally {
      console.log(JSON.stringify(act.getStatus()));
      const endTime = Date.now();
      const duration = endTime - startTime;
      console.log(`Time taken: ${duration}ms`);
      console.log('\n');
    }
  }
}

async function testFunctions<P, T>(scrapeMaster: ScrapeMaster<P, T>) {
  const act = new FoxNewsAct(scrapeMaster, 'https://www.outkick.com/', {
    elements: FoxNewsActCSSselector,
    undesiredURLs: FOXNEWS_UNDESIRED_URLS,
    desiredURLs: FOXNEWS_DESIRED_URLS,
    skipCategoryPages: FOXNEWS_CATEGORY_URLS,
  });
  console.log(await act.scrapeLandingPage());
}

async function main() {
  const scrapeMaster = await getPuppetMaster();
  try {
    await testCNBCAct(scrapeMaster);
    await testFoxNewsAct(scrapeMaster);
    await testFunctions(scrapeMaster);
  } finally {
    await scrapeMaster.close();
  }
}
// Example usage
try {
  await main();
} catch (error) {
  console.error(error);
}
