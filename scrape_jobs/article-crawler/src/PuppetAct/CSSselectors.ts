import { CSSSelector } from '../PuppetShow/ScrapeMaster';

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
type TypeCNBCActCSSselector = {
  podcastArticle: ElementsPageTypeConfig;
  makeItArticle: ElementsPageTypeConfig;
  proArticle: ElementsPageTypeConfig;
  selectArticle: ElementsPageTypeConfig;
} & TypeBaseCSSSelector;

const CNBCActCSSselector: TypeCNBCActCSSselector = {
  mainArticle: {
    checkLoadedPageElement: [
      '.branding-menu-logo',
      'href',
      '//www.cnbc.com/world/',
    ],
    undesired: false,
    contentElements: '.PageBuilder-article',
    authorElement: '.Author-authorName',
    postDatetimeElement:
      'time[data-testid="published-timestamp"][itemprop="datePublished"]',
  },
  podcastArticle: {
    checkLoadedPageElement: [
      '.PageHeaderWithTuneInText-title',
      'innerHTML',
      'Podcasts',
    ],
    undesired: true,
  },
  makeItArticle: {
    checkLoadedPageElement: [
      '.MakeItGlobalNav-styles-makeit-logo--sXqSs',
      'href',
      '//www.cnbc.com/make-it/',
    ],
    undesired: false,
  },
  proArticle: {
    checkLoadedPageElement: ['.ProPill-proPillLink', 'href', '/pro/'],
    undesired: true,
  },
  selectArticle: {
    checkLoadedPageElement: [
      '.logo-wrap > a:nth-child(1)',
      'href',
      'https://www.cnbc.com/select/',
    ],
    undesired: false,
  },
};

export {
  CNBCActCSSselector,
  TypeCNBCActCSSselector,
  TypeBaseCSSSelector,
  ElementsPageTypeConfig,
  PageType,
};
