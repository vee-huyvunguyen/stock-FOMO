import { ArticleAct, ArticleInfoExtractor, OtherLinks } from '..';
import { ScrapeMaster } from '../../../PuppetShow/ScrapeMaster';
import { RawArticlePage } from '../schemas';
import { PageType, TypeCNBCActCSSselector } from '../../CSSselectors';
import { getErrorMessage } from '../../../utils';
import {
  ElementHTML,
  ElementTextContent,
  ScrapedElement,
} from '../../../PuppetShow/ScrapedElement';
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
  async extractMainArticleContentElements(): Promise<
    [ElementHTML[] | undefined, ElementTextContent[] | undefined]
  > {
    const fieldNameDebug = 'article-content';
    let contentEles;
    try {
      contentEles = await this.scrapeMaster.selectElements(
        this.elements.mainArticle.contentElements,
        undefined,
        fieldNameDebug,
      );
    } catch (err) {
      this._statusHandler.addFieldsFailedToScrape([
        fieldNameDebug,
        getErrorMessage(err),
      ]);
      return [[], []];
    }
    let contents: ElementTextContent[] = [];
    let contentsElesHTML: ElementHTML[] = [];
    for (const ele of contentEles) {
      try {
        const tmpContent = await ele.text();
        if (!tmpContent) {
          continue;
        }
        contents.push(tmpContent);
      } catch (err) {
        this._statusHandler.addFieldsFailedToScrape([
          fieldNameDebug,
          getErrorMessage(err),
        ]);
        try {
          contentsElesHTML.push(await ele.getOuterHTML());
        } catch {}
      }
    }
    return [contentsElesHTML, contents];
  }
  async extractMainArticleAuthorElement(): Promise<
    [ElementHTML | undefined, ElementTextContent | undefined]
  > {
    const fieldNameDebug = 'author-info';
    let authorEle: ScrapedElement | undefined;
    let author = undefined;
    let authorHTML = undefined;
    let error = undefined;
    try {
      authorEle = await this.scrapeMaster.selectElement(
        this.elements.mainArticle.authorElement,
        undefined,
        fieldNameDebug,
      );
      if (!authorEle) {
        this._statusHandler.addFieldsFailedToScrape([
          fieldNameDebug,
          'undefined',
        ]);
        return [undefined, undefined];
      } else {
        try {
          author = await authorEle.text();
        } catch (err) {
          error = err;
        }
      }
    } catch (err) {
      error = err;
    }
    if (error) {
      this._statusHandler.addFieldsFailedToScrape([
        fieldNameDebug,
        getErrorMessage(error),
      ]);
      try {
        authorHTML = await (authorEle as ScrapedElement).getOuterHTML();
      } catch {}
    }
    return [authorHTML, author];
  }
  async extractMainArticlePostDatetimeElement(): Promise<
    [ElementHTML, DateTime]
  > {
    return [];
  }
  async extractMainArticleCategoryElement(): Promise<
    [ElementHTML, ElementTextContent]
  > {
    return [];
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
    throw new Error('Method not implemented.');
  }
  async mainArticleExtractor(): Promise<RawArticlePage> {
    let [contentEles, content] = await this.extractMainArticleContentElements();
    let [authorEle, author] = await this.extractMainArticleAuthorElement();
    let [postDatetimeEle, postDatetime] =
      await this.extractMainArticlePostDatetimeElement();
    let [categoryEle, category] =
      await this.extractMainArticleCategoryElement();
    let otherLinks: OtherLinks = await this.getOtherLinks();
    return {
      url: this.scrapeMaster.currentURL(),
      content_elements: contentEles,
      author_element: authorEle,
      post_datetime_element: postDatetimeEle,
      category_element: categoryEle,
      content: content,
      author: author,
      post_datetime: postDatetime,
      category: category,
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
