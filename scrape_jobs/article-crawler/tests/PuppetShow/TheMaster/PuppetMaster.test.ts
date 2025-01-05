import { Browser, Page, launch } from 'puppeteer';
import PuppetMaster from '../../../src/PuppetShow/ScrapeMaster/PuppetMaster';
import ConsoleWatcher from '../../../src/PuppetShow/TheWatcher/ConsoleWatcher';
import { firstQuote } from './testUtils';

describe('PuppetMaster', () => {
  let browser: Browser;
  let page: Page;
  let puppetMaster: PuppetMaster;
  const url = 'https://quotes.toscrape.com/';

  beforeAll(async () => {
    // Launch the browser and initialize the PuppetMaster
    browser = await launch();
    page = await browser.newPage();
    const watcher = new ConsoleWatcher({ level: 'warn' });
    puppetMaster = new PuppetMaster(page, browser, { logNullElement: false }, watcher);
  });

  afterAll(async () => {
    // Close the browser after all tests
    await browser.close();
  });

  it('should fetch the first quote correctly', async () => {
    await puppetMaster.goto(url);
    const titleElement = await puppetMaster.selectElement('div.quote:nth-child(1) > span:nth-child(1)');
    const title = await titleElement?.text();
    // expect(title).toHaveLength()
    expect(title).toBe(firstQuote);
  }, 10000);
});
