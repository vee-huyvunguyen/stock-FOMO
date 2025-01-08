type CSSSelector = string;
type ElementAttritbuteName = string;
type ElementAttritbute = string;

type TypeCNBCActCSSselector = {
  mainArticle: {
    checkLoadedPageElement: [
      CSSSelector,
      ElementAttritbuteName,
      ElementAttritbute,
    ];
    undesired: boolean
  };
  podcastArticle: {
    checkLoadedPageElement: [
      CSSSelector,
      ElementAttritbuteName,
      ElementAttritbute,
    ],
    undesired: boolean
  };
  makeItArticle: {
    checkLoadedPageElement: [
      CSSSelector,
      ElementAttritbuteName,
      ElementAttritbute,
    ];
    undesired: boolean
  };
  proArticle: {
    checkLoadedPageElement: [
      CSSSelector,
      ElementAttritbuteName,
      ElementAttritbute,
    ];
    undesired: boolean
  };
  selectArticle: {
    checkLoadedPageElement: [
      CSSSelector,
      ElementAttritbuteName,
      ElementAttritbute,
    ];
    undesired: boolean
  };
};

const CNBCActCSSselector: TypeCNBCActCSSselector = {
  mainArticle: {
    checkLoadedPageElement: [
      '.branding-menu-logo',
      'href',
      '//www.cnbc.com/world/',
    ],
    undesired: false
  },
  podcastArticle: {
    checkLoadedPageElement: [
      '.PageHeaderWithTuneInText-title',
      'innerHTML',
      'Podcasts',
    ],
    undesired: true
  },
  makeItArticle: {
    checkLoadedPageElement: [
      '.MakeItGlobalNav-styles-makeit-logo--sXqSs',
      'href',
      '//www.cnbc.com/make-it/',
    ],
    undesired: false
  },
  proArticle: {
    checkLoadedPageElement: ['.ProPill-proPillLink', 'href', '/pro/'],
    undesired: true
  },
  selectArticle: {
    checkLoadedPageElement: [
      '.logo-wrap > a:nth-child(1)',
      'href',
      'https://www.cnbc.com/select/',
    ],
    undesired: true
  },
};
