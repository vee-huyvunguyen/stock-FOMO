import { Actor } from 'apify';
import { PuppeteerCrawler, enqueueLinks } from 'crawlee';
import FoxNewsAct from './PuppetAct/ArticlesAct/FoxNewsAct/index.js';
import PuppetMaster from './PuppetShow/ScrapeMaster/PuppetMaster.js';
import { CNBC_UNDESIRED_URLS, FOXNEWS_UNDESIRED_URLS } from './PuppetAct/ActConfig/UndesiredURLs.js';
import { CNBCActCSSselector, FoxNewsActCSSselector } from './PuppetAct/ActConfig/CSSselectors.js';
import CNBCAct from './PuppetAct/ArticlesAct/CNBCAct/index.js';
import { FOXNEWS_DESIRED_URLS, CNBC_DESIRED_URLS } from './PuppetAct/ActConfig/DesiredURLs.js';
import { FOXNEWS_CATEGORY_URLS, CNBC_CATEGORY_URLS } from './PuppetAct/ActConfig/CategoryURLS.js';
import { pushDataToDB } from './utils.js';
import CrawleeWatcher from './PuppetShow/TheWatcher/CrawleeWatcher.js';

const ACT_REGISTRY = {
  foxnews: {
    ActClass: FoxNewsAct,
    selectors: FoxNewsActCSSselector,
    undesiredURLs: FOXNEWS_UNDESIRED_URLS,
    desiredURLs: FOXNEWS_DESIRED_URLS,
    skipCategoryPages: FOXNEWS_CATEGORY_URLS,
  },
  cnbc: {
    ActClass: CNBCAct,
    selectors: CNBCActCSSselector,
    undesiredURLs: CNBC_UNDESIRED_URLS,
    desiredURLs: CNBC_DESIRED_URLS,
    skipCategoryPages: CNBC_CATEGORY_URLS,
  },
} as const;

interface CrawlerInput {
  urls: Array<{
    url: string;
    site: keyof typeof ACT_REGISTRY;
  }>;
  maxPages?: number;
  skippingCategoryPages: boolean;
  JDBCConnectionString?: string;
}

await Actor.main(async () => {
  const input = await Actor.getInput<CrawlerInput>();
  if (!input?.urls) {
    throw new Error('Missing required input: urls');
  }

  const crawler = new PuppeteerCrawler({
    maxRequestsPerCrawl: input.maxPages,
    requestHandler: async ({ page, request, crawler: crawlerInstance, log }) => {
      const watcher = new CrawleeWatcher(log);
      const scrapeMaster = new PuppetMaster(
        page,
        page.browser(),
        { logNullElement: false },
        watcher,
      );

      const { site } = request.userData;
      const siteConfig = ACT_REGISTRY[site as keyof typeof ACT_REGISTRY];
      if (!siteConfig) {
        throw new Error(`Unsupported site: ${site}`);
      }

      const act = new siteConfig.ActClass(scrapeMaster, request.url, {
        elements: siteConfig.selectors,
        undesiredURLs: siteConfig.undesiredURLs,
        desiredURLs: siteConfig.desiredURLs,
        skipCategoryPages: input.skippingCategoryPages ? siteConfig.skipCategoryPages : undefined,
      });

      // Skip non-news pages before scraping
      if (act.checkURLIsUndesired(request.url)) {
        const otherLinks = await act.getOtherLinks();
        if (crawlerInstance?.requestQueue) {
          await enqueueLinks({
            urls: otherLinks.news,
            requestQueue: crawlerInstance.requestQueue,
            userData: request.userData,
          });
        }
        return;
      }

      const data = await act.scrape();
      if (input.JDBCConnectionString) {
        process.env.DATABASE_URL = input.JDBCConnectionString;
        await pushDataToDB(data, watcher);
      } else {
        await Actor.pushData(data);
      }

      // Enqueue additional article links if present
      if (data.other_article_links?.length) {
        const requests = data.other_article_links.map((url) => ({
          url,
          userData: request.userData, // Maintain same site context
        }));
        await crawlerInstance.addRequests(requests);
      }
    },
  });

  // Prepare requests with site metadata
  const requests = input.urls.map(({ url, site }) => ({
    url,
    userData: { site },
  }));

  await crawler.run(requests);
});
