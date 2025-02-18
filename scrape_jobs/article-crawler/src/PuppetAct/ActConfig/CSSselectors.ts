import { CSSSelector } from 'PuppetShow/ScrapeMaster';

type ElementAttritbuteName = string;
type ElementAttritbute = string;
type PageType = 'mainArticle' | string;
type ElementsPageTypeConfig = {
  checkLoadedPageElement: [
    CSSSelector,
    ElementAttritbuteName,
    ElementAttritbute,
  ];
  undesired: boolean;
  [key: string]: any; // Allows additional fields with any type
};
type TypeBaseCSSSelector = {
  mainArticle: ElementsPageTypeConfig;
  [key: string]: ElementsPageTypeConfig;
};

const CNBCActCSSselector: TypeBaseCSSSelector = {
  mainArticle: {
    // Example: https://www.cnbc.com/2025/02/03/stock-market-today-live-updates.html
    checkLoadedPageElement: [
      'a.branding-menu-logo',
      'href',
      'https://www.cnbc.com/world/',
    ],
    undesired: false,
    // Title of the article is not always the .title of the html page
    // Still have to get it independently
    articleTitleElement: 'h1[class*="-headline"]',
    contentElements: 'div.PageBuilder-article',
    authorElements: 'a.Author-authorName', // sometimes there are multiple authors
    postDatetimeElement:
      'time[data-testid="published-timestamp"][itemprop="datePublished"]',
    updatedDatetimeElement:
      'time[data-testid="lastpublished-timestamp"][itemprop="dateModified"]',
    categoryElement: '.ArticleHeader-eyebrow', // get the href
  },
  makeItArticle: {
    // Example: https://www.cnbc.com/2025/01/28/tech-worker-saved-up-to-90-percent-of-his-pay-and-retired-with-3point5-million-dollars.html
    checkLoadedPageElement: [
      '.MakeItGlobalNav-styles-makeit-logo--sXqSs',
      'href',
      'https://www.cnbc.com/make-it/',
    ],
    undesired: false,
    articleTitleElement: 'h1[class^="ArticleHeader-styles-makeit-headline--"]',
    contentElements: '[data-module="ArticleBody"]',
    authorElements: 'a[class^="Author-styles-makeit-authorName--"]',
    postDatetimeElement:
      'time[data-testid="published-timestamp"][itemprop="datePublished"]',
    updatedDatetimeElement:
      'time[data-testid="lastpublished-timestamp"][itemprop="dateModified"]',
    categoryElement: 'a[class^="ArticleHeader-styles-makeit-eyebrow--"]', // get the href
  },
  selectArticle: {
    // Example: https://www.cnbc.com/select/best-mortgage-lenders-first-time-homebuyers/
    checkLoadedPageElement: [
      '.logo-wrap > a:nth-child(1)',
      'href',
      'https://www.cnbc.com/select/',
    ],
    undesired: false,
    articleTitleElement: 'h1[class^="ArticleHeader-styles-select-headline--"]',
    contentElements: '[data-module="ArticleBody"]',
    authorElements: 'a[class^="Author-styles-select-authorName--"]',
    // Can only get as text, doesn't have datetime attribute
    // sometimes "Updated 5 minutes ago" -> still ok and have to infer later
    postDatetimeElement: '[class^="ArticleHeader-styles-select-time--"]',
    // doesn't have updatedDatetimeElement -> still ok
    categoryElement: '[class^="ArticleHeader-styles-select-eyebrow--"]', // get the href
  },
  podcastArticle: {
    // Example: https://www.cnbc.com/podcasts/the-takeout/
    checkLoadedPageElement: [
      '.PageHeaderWithTuneInText-title',
      'innerHTML',
      'Podcasts',
    ],
    undesired: true,
  },
  proArticle: {
    // Example: https://www.cnbc.com/2025/02/04/mondays-turnaround-showed-little-guy-continues-to-drive-bull-market.html
    checkLoadedPageElement: [
      '.ArticleHeader-wrapperHeroNoImage > a.ProPill-proPillLink[data-type="pro-button"]',
      'href',
      'https://www.cnbc.com/pro/',
    ],
    undesired: true,
  },
};

const FoxNewsActCSSselector: TypeBaseCSSSelector = {
  mainArticle: {
    // Example: https://www.foxnews.com/us/4-fema-employees-fired-over-egregious-payments-migrants-dhs-says
    checkLoadedPageElement: ['a.logo', 'href', 'https://www.foxnews.com/'],
    undesired: false,
    articleTitleElement:
      'div.article-meta.article-meta-upper > h1.headline.speakable',
    contentElements: 'div.article-content',
    authorElements: 'div.author-byline > span > span > a', // Example of 2 authors: https://www.foxnews.com/opinion/children-deserve-better-than-cartoonish-culture-war
    postDatetimeElement:
      'header.article-header > div > span.article-date > time',
    // Example with both updated and published datetime: https://www.foxnews.com/opinion/ai-cant-wait-why-need-speed-win
    updatedDatetimeElement:
      'header.article-header > div > span.article-update-date > time',
    categoryElement: 'div.article-meta.article-meta-upper > span.eyebrow > a',
  },
  businessArticle: {
    // Example: https://www.foxbusiness.com/media/jon-taffer-schools-democrat-leader-pointing-fingers-trump-over-rising-prices
    checkLoadedPageElement: [
      'div.branding > a.logo',
      'href',
      'https://www.foxbusiness.com/',
    ],
    undesired: false,
    articleTitleElement: 'header.article-header > h1.headline',
    contentElements: 'div.article-content',
    authorElements: 'span.authors > span.author > a', // Example of 2 authors: https://www.foxbusiness.com/entertainment/top-cities-where-la-wildfire-victims-relocating-celebrity-realtor
    postDatetimeElement:
      'time.article-date__time.article-date__time--published',
    // Example with both updated and published datetime: https://www.foxbusiness.com/economy/best-five-states-start-business
    updatedDatetimeElement:
      'time.article-date__time.article-date__time--updated',
    categoryElement:
      'header.article-header > div.article-meta.article-meta-upper > div.eyebrow > a',
  },
  outkickArticle: {
    // Example: https://www.outkick.com/culture/rachel-stuhlmann-slides-pink-tennis-outfit-valentines-day-eagles-fans-fighting-baja-blast-pie
    checkLoadedPageElement: [
      'header.site-header > div.inner > div.logo > a',
      'href',
      'https://www.outkick.com/',
    ],
    undesired: false,
    articleTitleElement:
      'div.article-content > header.article-header > h1.headline',
    contentElements: 'div.article-content > div.article-body',
    authorElements: 'div.author-name > span > a',
    postDatetimeElement:
      'span.article-date-published > time.time.time-published',
    updatedDatetimeElement:
      'span.article-date-updated > time.time.time-updated',
    categoryElement:
      'div.article-meta.article-meta-upper > nav.breadcrumbs > ul > li:nth-child(2) > a',
    tagElements: 'div.article-tags.tags > ul > li > strong > a',
  },
  weatherArticle: {
    // Example: https://www.foxweather.com/weather-news/saturday-sunday-storm-snow-rain-severe-midwest-northeast-southeast
    checkLoadedPageElement: [
      'div.branding span > a.logo',
      'href',
      'https://www.foxweather.com/',
    ],
    undesired: false,
    articleTitleElement: 'header.article-header > h1.headline',
    contentElements: 'div.article-content > div.article-body',
    authorElements: 'span.author-list > span > a',
    postDatetimeElement:
      'time.article-date__time.article-date__time--published',
    // Example with both updated and published datetime: https://www.foxweather.com/learn/northeast-winter-storms-peak-months
    updatedDatetimeElement:
      'time.article-date__time.article-date__time--updated',
    categoryElement:
      'header.article-header > div.article-meta.article-meta-upper > div.eyebrow > a',
  },
  // TODO: add fields for tagging the article > update both CSS selectors and RawArticlePage schema
};

export {
  CNBCActCSSselector,
  FoxNewsActCSSselector,
  TypeBaseCSSSelector,
  ElementsPageTypeConfig,
  PageType,
};
