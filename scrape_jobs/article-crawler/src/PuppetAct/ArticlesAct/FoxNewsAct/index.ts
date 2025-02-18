import { ArticleAct, ArticleInfoExtractor } from '../index.js';
import { TypeBaseCSSSelector } from '../../../PuppetAct/ActConfig/CSSselectors.js';

export default class FoxNewsAct<P, T> extends ArticleAct<P, T> {
  checkURLIsNewsPage(url: string): boolean {
    if (this.checkURLIsUndesired(url)) {
      return false;
    }
    return true;
  }

  getInfoExtractor(pageType: keyof TypeBaseCSSSelector): ArticleInfoExtractor {
    const extractors: Record<keyof TypeBaseCSSSelector, ArticleInfoExtractor> = {
      mainArticle: this.commonArticleExtractor,
      businessArticle: this.commonArticleExtractor,
      outkickArticle: this.commonArticleExtractor,
      weatherArticle: this.commonArticleExtractor,
    };
    return extractors[pageType];
  }
}
