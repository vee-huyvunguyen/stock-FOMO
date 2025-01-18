import {
  ArticleAct,
  ArticleInfoExtractor,
  ElementExtractCheck,
  ElementExtractedContent,
  ElementsExtractedContent,
  OtherLinks,
} from '@/PuppetAct/ArticlesAct';
import { ScrapeMaster } from '@/PuppetShow/ScrapeMaster';
import { RawArticlePage } from '@/PuppetAct/ArticlesAct/schemas';
import { PageType, TypeCNBCActCSSselector } from '@/PuppetAct/CSSselectors';
import { DateTime } from 'luxon';

export default class CNBCAct extends ArticleAct {
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
  async extractMainArticleContentElements(): Promise<ElementsExtractedContent> {
    const fieldNameDebug = 'MainArticle-article-content';
    let elementsExtractCheck: ElementExtractCheck[] =
      await this.extractElementsStatusCheck(
        this.elements.mainArticle.contentElements,
        fieldNameDebug,
      );
    return this.toElementsExtractedContent(elementsExtractCheck);
  }
  async extractMainArticleAuthorElement(): Promise<ElementExtractedContent> {
    const fieldNameDebug = 'MainArticle-author-info';
    let elementExtractCheck: ElementExtractCheck =
      await this.extractElementStatusCheck(
        this.elements.mainArticle.authorElement,
        fieldNameDebug,
        'href',
      );
    return this.toElementExtractedContent(elementExtractCheck);
  }
  async extractMainArticlePostDatetimeElement(): Promise<ElementExtractedContent> {
    const fieldNameDebug = 'MainArticle-post-datetime';
    let elementExtractCheck: ElementExtractCheck =
      await this.extractElementStatusCheck(
        this.elements.mainArticle.postDatetimeElement,
        fieldNameDebug,
      );
    return this.toElementExtractedContent(elementExtractCheck);
  }
  async extractMainArticleCategoryElement(): Promise<ElementExtractedContent> {
    const fieldNameDebug = 'MainArticle-category';
    let elementExtractCheck: ElementExtractCheck =
      await this.extractElementStatusCheck(
        this.elements.mainArticle.categoryElement,
        fieldNameDebug,
        'href',
      );
    return this.toElementExtractedContent(elementExtractCheck);
  }
  getInfoExtractor(
    pageType: keyof TypeCNBCActCSSselector,
  ): ArticleInfoExtractor {
    let extractors: Record<keyof TypeCNBCActCSSselector, ArticleInfoExtractor> =
      {
        mainArticle: this.mainArticleExtractor,
        makeItArticle: this.makeItArticleExtractor,
        selectArticle: this.selectArticleExtractor,
      };
    return extractors[pageType];
  }

  async scrape(): Promise<RawArticlePage> {
    await this.loadNewsPage();
    throw new Error('Method not implemented.');
  }
  async mainArticleExtractor(): Promise<RawArticlePage> {
    let content = await this.extractMainArticleContentElements();
    let author = await this.extractMainArticleAuthorElement();
    let postDatetime = await this.extractMainArticlePostDatetimeElement();
    let category = await this.extractMainArticleCategoryElement();
    let otherLinks: OtherLinks = await this.getOtherLinks();
    return {
      url: this.scrapeMaster.currentURL(),
      content_elements: content.eleHTML,
      author_element: author.eleHTML,
      post_datetime_element: postDatetime.eleHTML,
      category_element: category.eleHTML,
      content: content.textContent,
      author: author.textContent,
      post_datetime: postDatetime.textContent,
      category: category.textContent,
      scrape_status: this._statusHandler.scrapeStatus,
      scraped_at: DateTime.now().toUTC(),
      other_article_links: otherLinks.news,
      other_links: otherLinks.other,
    };
  }
  async makeItArticleExtractor(): Promise<RawArticlePage> {
    throw new Error('Not Implemented');
  }
  async selectArticleExtractor(): Promise<RawArticlePage> {
    throw new Error('Not Implemented');
  }
}
