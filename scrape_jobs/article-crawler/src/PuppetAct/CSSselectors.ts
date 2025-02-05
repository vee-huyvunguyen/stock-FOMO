import { CSSSelector } from '@/PuppetShow/ScrapeMaster';

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
      '.branding-menu-logo',
      'href',
      'https://www.cnbc.com/world/',
    ],
    undesired: false,
    // Title of the article is not always the .title of the html page
    // Still have to get it independently
    articleTitleElement: 'h1.LiveBlogHeader-headline',
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
    contentElements: '[data-module="ArticleBody"]',
    authorElements: 'a[class^="Author-styles-makeit-authorName--"]',
    postDatetimeElement: 'time[data-testid="published-timestamp"][itemprop="datePublished"]',
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
    contentElements: '[data-module="ArticleBody"]',
    authorElement: 'a[class^="Author-styles-select-authorName--"]',
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
      '.ProPill-proPillLink',
      'href',
      'https://www.cnbc.com/pro/',
    ],
    undesired: true,
  },
};

export {
  CNBCActCSSselector,
  TypeBaseCSSSelector,
  ElementsPageTypeConfig,
  PageType,
};
