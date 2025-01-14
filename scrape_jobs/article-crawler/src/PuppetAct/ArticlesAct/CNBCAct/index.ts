import { ArticleAct, ArticleInfoExtractor, OtherLinks } from '..';
import { ScrapeMaster } from '../../../PuppetShow/ScrapeMaster';
import { RawArticlePage } from '../schemas';
import { PageType, TypeCNBCActCSSselector } from '../../CSSselectors';
import MainArticleExtractor from './extractors/MainArticleExtractor';
import MakeItArticleExtractor from './extractors/MakeItArticleExtractor';
import SelectArticleExtractor from './extractors/SelectArticleExtractor';

class CNBCAct extends ArticleAct {
  constructor(
    scrapeMaster: ScrapeMaster,
    articleURL: string,
    elements: TypeCNBCActCSSselector,
    manualPageType?: string,
  ) {
    super(scrapeMaster, articleURL, elements, manualPageType);
  }

  checkURLIsNewsPage(url: string, pageType: PageType): boolean {
    if (pageType == 'selectArticle') {
      // The url will have the format of https://www.cnbc.com/select/{article-title}/
      // E.g.: https://www.cnbc.com/select/citi-double-cash-vs-costco-anywhere-visa/
      const regex = /https:\/\/www\.cnbc\.com\/select\/[a-zA-Z0-9-]+\//;
      return regex.test(url);
    } else {
      // The url will have the format of https://www.cnbc.com/{posted-year}/{posted-day}/{posted-month}/{article-title}.html
      // E.g.: https://www.cnbc.com/2025/01/08/apothekary-ceo-top-red-flag-i-see-in-employees-poor-communication.html
      const regex =
        /https:\/\/www\.cnbc\.com\/[0-9]{4}\/[0-9]{2}\/[0-9]{2}\/[a-zA-Z0-9-]+\.html/;
      return regex.test(url);
    }
  }
  getInfoExtractor(
    pageType: keyof TypeCNBCActCSSselector,
  ): ArticleInfoExtractor {
    let extractors: Record<keyof TypeCNBCActCSSselector, ArticleInfoExtractor> =
      {
        mainArticle: MainArticleExtractor,
        makeItArticle: MakeItArticleExtractor,
        selectArticle: SelectArticleExtractor,
      };
    return extractors[pageType];
  }

  async scrape(): Promise<RawArticlePage> {
    throw new Error('Method not implemented.');
  }
}

export default CNBCAct;
