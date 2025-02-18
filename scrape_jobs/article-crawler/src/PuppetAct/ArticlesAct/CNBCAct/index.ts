import { ArticleAct, ArticleInfoExtractor } from '../index.js';
import { RawArticlePage } from '../schemas.js';
import {
  PageType,
  TypeBaseCSSSelector,
} from '../../../PuppetAct/ActConfig/CSSselectors.js';

export default class CNBCAct<P, T> extends ArticleAct<P, T> {
  checkURLIsNewsPage(url: string, pageType: PageType): boolean {
    if (this.checkURLIsUndesired(url)) {
      return false;
    }
    if (pageType === 'selectArticle') {
      // The url will have the format of https://www.cnbc.com/select/{article-title}/
      // E.g.: https://www.cnbc.com/select/citi-double-cash-vs-costco-anywhere-visa/
      const regex = /https:\/\/www\.cnbc\.com\/select\/[a-zA-Z0-9-]+\//;
      return regex.test(url);
    }
    // The url will have the format of https://www.cnbc.com/{posted-year}/{posted-day}/{posted-month}/{article-title}.html
    // E.g.: https://www.cnbc.com/2025/01/08/apothekary-ceo-top-red-flag-i-see-in-employees-poor-communication.html
    const regex = /https:\/\/www\.cnbc\.com\/[0-9]{4}\/[0-9]{2}\/[0-9]{2}\/[a-zA-Z0-9-]+\.html/;
    return regex.test(url);
  }

  getInfoExtractor(pageType: keyof TypeBaseCSSSelector): ArticleInfoExtractor {
    const extractors: Record<keyof TypeBaseCSSSelector, ArticleInfoExtractor> = {
      mainArticle: this.mainArticleExtractor,
      makeItArticle: this.makeItArticleExtractor,
      selectArticle: this.selectArticleExtractor,
    };
    return extractors[pageType];
  }

  selectArticleExtractor = async (): Promise<RawArticlePage> => {
    return await this.commonArticleExtractor(['article_updated_datetime']);
  };

  makeItArticleExtractor = async (): Promise<RawArticlePage> => {
    return await this.commonArticleExtractor();
  };

  mainArticleExtractor = async (): Promise<RawArticlePage> => {
    return await this.commonArticleExtractor();
  };
}
