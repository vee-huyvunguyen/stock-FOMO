import FoxNewsAct from '@/PuppetAct/ArticlesAct/FoxNewsAct';
import ConsoleWatcher from '@/PuppetShow/TheWatcher/ConsoleWatcher';
import PuppetMaster from '@/PuppetShow/ScrapeMaster/PuppetMaster';
import { CNBC_UNDESIRED_URLS, FOXNEWS_UNDESIRED_URLS } from '@/PuppetAct/ActConfig/UndesiredURLs';
import { CNBCActCSSselector, FoxNewsActCSSselector } from '@/PuppetAct/ActConfig/CSSselectors';

import { Actor } from 'apify';
import { PuppeteerCrawler } from 'crawlee';
import CNBCAct from './PuppetAct/ArticlesAct/CNBCAct';

const ACT_REGISTRY = {
  foxnews: {
      ActClass: FoxNewsAct,
      selectors: FoxNewsActCSSselector,
      undesiredUrls: FOXNEWS_UNDESIRED_URLS
  },
  cnbc: {
      ActClass: CNBCAct,
      selectors: CNBCActCSSselector,
      undesiredUrls: CNBC_UNDESIRED_URLS
  }
} as const;

interface CrawlerInput {
  urls: Array<{ 
    url: string;
    site: keyof typeof ACT_REGISTRY;
  }>;
  maxPages?: number;
}

await Actor.main(async () => {
    const input = await Actor.getInput<CrawlerInput>();
    if (!input?.urls) {
        throw new Error('Missing required input: urls');
    }

    const crawler = new PuppeteerCrawler({
        maxRequestsPerCrawl: input.maxPages || 100,
        requestHandler: async ({ page, request }) => {
            const watcher = new ConsoleWatcher({ level: 'warn' });
            const scrapeMaster = new PuppetMaster(
                page, 
                page.browser(), 
                { logNullElement: false }, 
                watcher
            );

            const site: string = request.userData.site;
            const siteConfig = ACT_REGISTRY[site as keyof typeof ACT_REGISTRY];
            if (!siteConfig) {
                throw new Error(`Unsupported site: ${site}`);
            }

            const act = new siteConfig.ActClass(
                scrapeMaster,
                request.url,
                {
                    elements: siteConfig.selectors,
                    undesiredURLs: siteConfig.undesiredUrls
                }
            );

            const data = await act.scrape();
            await Actor.pushData(data);
        }
    });

    // Prepare requests with site metadata
    const requests = input.urls.map(({ url, site }) => ({
        url,
        userData: { site }
    }));

    await crawler.run(requests);
});
