import { ScrapeMaster } from 'PuppetShow/ScrapeMaster';
import {
  ArticleAct,
  ArticleInfoExtractor
} from 'PuppetAct/ArticlesAct';
import { TypeBaseCSSSelector } from 'PuppetAct/ActConfig/CSSselectors';
import { ArticleActConfig } from 'PuppetAct/ActConfig';

export default class FoxNewsAct<P, T> extends ArticleAct<P, T> {
  constructor(
    scrapeMaster: ScrapeMaster<P, T>,
    articleURL: string,
    actConfig: ArticleActConfig,
    manualPageType?: string,
  ) {
    super(scrapeMaster, articleURL, actConfig, manualPageType);
  }

  checkURLIsNewsPage(url: string): boolean {
    if (this.checkURLIsUndesired(url)) {
      return false;
    }
    return true;
  }

  getInfoExtractor(pageType: keyof TypeBaseCSSSelector): ArticleInfoExtractor {
    let extractors: Record<keyof TypeBaseCSSSelector, ArticleInfoExtractor> = {
      mainArticle: this.commonArticleExtractor,
      businessArticle: this.commonArticleExtractor,
      outkickArticle: this.commonArticleExtractor,
      weatherArticle: this.commonArticleExtractor,
    };
    return extractors[pageType];
  }
}
