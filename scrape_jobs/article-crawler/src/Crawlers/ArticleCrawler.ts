import FoxNewsAct from '@/PuppetAct/ArticlesAct/FoxNewsAct';
import CNBCAct from '@/PuppetAct/ArticlesAct/CNBCAct';
import ConsoleWatcher from '@/PuppetShow/TheWatcher/ConsoleWatcher';
import PuppetMaster from '@/PuppetShow/ScrapeMaster/PuppetMaster';
import { FOXNEWS_UNDESIRED_URLS, CNBC_UNDESIRED_URLS } from '@/PuppetAct/ActConfig/UndesiredURLs';
import { FoxNewsActCSSselector, CNBCActCSSselector } from '@/PuppetAct/ActConfig/CSSselectors';

import { PuppeteerCrawler } from 'crawlee';

// Modify input structure
interface ArticleRequest {
    url: string;
    site: keyof typeof ACT_REGISTRY; // 'foxnews' | 'cnbc'
}

const crawler = new PuppeteerCrawler({
    maxRequestsPerCrawl: input.maxPages || 100,
    requestHandler: async ({ page, request }) => {
        const site = request.userData.site;  // Get from request metadata
        const siteConfig = ACT_REGISTRY[site];
        
        const watcher = new ConsoleWatcher({ level: 'warn' });
        const scrapeMaster = new PuppetMaster(
            page, 
            page.browser(), 
            { logNullElement: false }, 
            watcher
        );
        
        // Create appropriate act using siteConfig
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

// When starting the crawl
const requests = input.urls.map((req: ArticleRequest) => ({
    url: req.url,
    userData: {  // Crawlee's request metadata
        site: req.site
    }
}));

await crawler.run(requests);
