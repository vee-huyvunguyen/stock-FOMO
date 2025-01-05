import CheerioMaster from '../../../src/PuppetShow/ScrapeMaster/CheerioMaster';
import ConsoleWatcher from '../../../src/PuppetShow/TheWatcher/ConsoleWatcher';
import { firstQuote } from './testUtils';
import { Agent } from 'http';
import { Agent as HttpsAgent } from 'https';

describe('PuppetMaster', () => {
  let cheerioMaster: CheerioMaster;
  const watcher = new ConsoleWatcher({ level: 'warn' });
  const url = 'https://quotes.toscrape.com/';
  const httpAgent = new Agent({ keepAlive: false });
  const httpsAgent = new HttpsAgent({ keepAlive: false });

  beforeAll(async () => {
    // Initialize the CheerioMaster
    const page = await CheerioMaster.loadCheerioAPI(url, { httpAgent, httpsAgent });
    cheerioMaster = new CheerioMaster({ logNullElement: false }, page, watcher, url)
  });

  it('should fetch the first quote correctly', async () => {
    await cheerioMaster.goto(url);
    const titleElement = await cheerioMaster.selectElement('div.quote:nth-child(1) > span:nth-child(1)');
    const title = await titleElement?.text();
    // expect(title).toHaveLength()
    expect(title).toBe(firstQuote);
  });
});
