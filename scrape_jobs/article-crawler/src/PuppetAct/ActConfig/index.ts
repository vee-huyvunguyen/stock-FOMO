import { TypeBaseCSSSelector } from './CSSselectors.js';

type ArticleActConfig = {
  elements: TypeBaseCSSSelector;
  undesiredURLs: string[];
  desiredURLs: string[];
};

export { ArticleActConfig };
