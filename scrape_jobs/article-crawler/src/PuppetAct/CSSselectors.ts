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
    checkLoadedPageElement: [
      '.branding-menu-logo',
      'href',
      'https://www.cnbc.com/world/',
    ],
    undesired: false,
    contentElements: '.PageBuilder-article',
    authorElements: '.Author-authorName',
    postDatetimeElement:
      'time[data-testid="published-timestamp"][itemprop="datePublished"]',
    categoryElement: '.ArticleHeader-eyebrow',
  },
  makeItArticle: {
    checkLoadedPageElement: [
      '.MakeItGlobalNav-styles-makeit-logo--sXqSs',
      'href',
      'https://www.cnbc.com/make-it/',
    ],
    undesired: false,
    // TODO: check if the author elements can be selected with multiple authors
    contentElements: '[data-module="ArticleBody"]',
    authorElements: '.Author-styles-makeit-authorName--_ANaL"',
    postDatetimeElement: '.ArticleHeader-styles-makeit-time--hKeEh',
    categoryElement: '.ArticleHeader-styles-makeit-eyebrow--Degp4',
  },
  selectArticle: {
    checkLoadedPageElement: [
      '.logo-wrap > a:nth-child(1)',
      'href',
      'https://www.cnbc.com/select/',
    ],
    undesired: false,
    contentElements: '[data-module="ArticleBody"]',
    authorElement: '.Author-styles-makeit-authorName--_ANaL"',
    postDatetimeElement: '.ArticleHeader-styles-makeit-time--hKeEh',
    categoryElement: '.ArticleHeader-styles-makeit-eyebrow--Degp4',
  },
  podcastArticle: {
    checkLoadedPageElement: [
      '.PageHeaderWithTuneInText-title',
      'innerHTML',
      'Podcasts',
    ],
    undesired: true,
  },
  proArticle: {
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
