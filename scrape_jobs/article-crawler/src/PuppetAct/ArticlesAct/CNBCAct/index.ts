import {
  ArticleAct,
  ArticleInfoExtractor,
  OtherLinks,
} from '@/PuppetAct/ArticlesAct';
import { ScrapeMaster } from '@/PuppetShow/ScrapeMaster';
import { RawArticlePage } from '@/PuppetAct/ArticlesAct/schemas';
import { PageType, TypeBaseCSSSelector } from '@/PuppetAct/ActConfig/CSSselectors';
import { ArticleActConfig } from '@/PuppetAct/ActConfig';

export default class CNBCAct<P, T> extends ArticleAct<P, T> {
  constructor(
    scrapeMaster: ScrapeMaster<P, T>,
    articleURL: string,
    actConfig: ArticleActConfig,
    manualPageType?: string,
  ) {
    super(scrapeMaster, articleURL, actConfig, manualPageType);
  }

  checkURLIsNewsPage(url: string, pageType: PageType): boolean {
    if (this.checkURLIsUndesired(url)) {
      return false;
    }
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

  getInfoExtractor(pageType: keyof TypeBaseCSSSelector): ArticleInfoExtractor {
    let extractors: Record<keyof TypeBaseCSSSelector, ArticleInfoExtractor> = {
      mainArticle: this.commonArticleExtractor,
      makeItArticle: this.commonArticleExtractor,
      selectArticle: this.selectArticleExtractor,
    };
    return extractors[pageType];
  }

  selectArticleExtractor = async (): Promise<RawArticlePage> => {
    let content = await this.extractArticleCommonElement(
      'contentElements',
      'MainArticle-article-content',
      true,
    );
    let authors = await this.extractArticleCommonElement(
      'authorElements',
      'MainArticle-author-info',
      true,
      'href'
    );
    let publishedDatetime = await this.extractArticleCommonElement(
      'postDatetimeElement',
      'MainArticle-post-datetime',
      false,
    );
    let category = await this.extractArticleCommonElement(
      'categoryElement',
      'MainArticle-category',
      false,
      'href'
    );
    let title = await this.extractArticleCommonElement(
      'articleTitleElement',
      'MainArticle-title',
      false,
    );
    let otherLinks: OtherLinks = await this.getOtherLinks();
    return {
      content_elements: content.eleHTML,
      author_elements: authors.eleHTML,
      article_published_datetime_element: publishedDatetime.eleHTML,
      article_title_element: title.eleHTML,
      category_element: category.eleHTML,
      content: content.textContent,
      authors: authors.textContent,
      article_published_datetime: publishedDatetime.textContent,
      article_title: title.textContent,
      category: category.textContent,
      other_article_links: otherLinks.news,
      other_links: otherLinks.other,
      ...(await this.getDefaultRawArticlePage()),
    };
  };
}
