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
import { PageType, TypeBaseCSSSelector } from '@/PuppetAct/CSSselectors';

export default class CNBCAct<P, T> extends ArticleAct<P, T> {
  constructor(
    scrapeMaster: ScrapeMaster<P, T>,
    articleURL: string,
    elements: TypeBaseCSSSelector,
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
    let elementsExtractCheck: ElementExtractCheck<P, T>[] =
      await this.extractElementsStatusCheck(
        this.elements.mainArticle.contentElements,
        fieldNameDebug,
      );
    return this.toElementsExtractedContent(elementsExtractCheck);
  }
  async extractMainArticleAuthorElement(): Promise<ElementsExtractedContent> {
    const fieldNameDebug = 'MainArticle-author-info';
    let elementsExtractCheck: ElementExtractCheck<P, T>[] =
      await this.extractElementsStatusCheck(
        this.elements.mainArticle.authorElements,
        fieldNameDebug,
        'href',
      );
    return this.toElementsExtractedContent(elementsExtractCheck);
  }
  async extractMainArticlePostDatetimeElement(): Promise<ElementExtractedContent> {
    const fieldNameDebug = 'MainArticle-post-datetime';
    let elementExtractCheck: ElementExtractCheck<P, T> =
      await this.extractElementStatusCheck(
        this.elements.mainArticle.postDatetimeElement,
        fieldNameDebug,
      );
    return this.toElementExtractedContent(elementExtractCheck);
  }
  async extractMainArticleCategoryElement(): Promise<ElementExtractedContent> {
    const fieldNameDebug = 'MainArticle-category';
    let elementExtractCheck: ElementExtractCheck<P, T> =
      await this.extractElementStatusCheck(
        this.elements.mainArticle.categoryElement,
        fieldNameDebug,
        'href',
      );
    return this.toElementExtractedContent(elementExtractCheck);
  }
  async extractMainArticleTitleElement(): Promise<ElementExtractedContent> {
    const fieldNameDebug = 'MainArticle-title';
    let elementExtractCheck: ElementExtractCheck<P, T> =
      await this.extractElementStatusCheck(
        this.elements.mainArticle.articleTitleElement,
        fieldNameDebug,
      );
    return this.toElementExtractedContent(elementExtractCheck);
  }
  async extractMainArticleUpdatedDatetimeElement(): Promise<ElementExtractedContent> {
    const fieldNameDebug = 'MainArticle-updated-datetime';
    let elementExtractCheck: ElementExtractCheck<P, T> =
      await this.extractElementStatusCheck(
        this.elements.mainArticle.updatedDatetimeElement,
        fieldNameDebug,
      );
    return this.toElementExtractedContent(elementExtractCheck);
  }
  getInfoExtractor(pageType: keyof TypeBaseCSSSelector): ArticleInfoExtractor {
    let extractors: Record<keyof TypeBaseCSSSelector, ArticleInfoExtractor> = {
      mainArticle: this.mainArticleExtractor,
      makeItArticle: this.makeItArticleExtractor,
      selectArticle: this.selectArticleExtractor,
    };
    return extractors[pageType];
  }

  mainArticleExtractor = async (): Promise<RawArticlePage> => {
    let content = await this.extractMainArticleContentElements();
    let authors = await this.extractMainArticleAuthorElement();
    let publishedDatetime = await this.extractMainArticlePostDatetimeElement();
    let updatedDatetime = await this.extractMainArticleUpdatedDatetimeElement();
    let category = await this.extractMainArticleCategoryElement();
    let title = await this.extractMainArticleTitleElement();
    let otherLinks: OtherLinks = await this.getOtherLinks();
    return {
      content_elements: content.eleHTML,
      author_elements: authors.eleHTML,
      article_published_datetime_element: publishedDatetime.eleHTML,
      article_updated_datetime_element: updatedDatetime.eleHTML,
      article_title_element: title.eleHTML,
      category_element: category.eleHTML,
      content: content.textContent,
      authors: authors.textContent,
      article_published_datetime: publishedDatetime.textContent,
      article_updated_datetime: updatedDatetime.textContent,
      article_title: title.textContent,
      category: category.textContent,
      other_article_links: otherLinks.news,
      other_links: otherLinks.other,
      ...(await this.getDefaultRawArticlePage()),
    };
  };
  async extractMakeItArticleContentElements(): Promise<ElementsExtractedContent> {
    const fieldNameDebug = 'MakeItArticle-article-content';
    let elementsExtractCheck: ElementExtractCheck<P, T>[] =
      await this.extractElementsStatusCheck(
        this.elements.makeItArticle.contentElements,
        fieldNameDebug,
      );
    return this.toElementsExtractedContent(elementsExtractCheck);
  }
  async extractMakeItArticleAuthorElement(): Promise<ElementsExtractedContent> {
    const fieldNameDebug = 'MakeItArticle-author-info';
    let elementsExtractCheck: ElementExtractCheck<P, T>[] =
      await this.extractElementsStatusCheck(
        this.elements.makeItArticle.authorElements,
        fieldNameDebug,
        'href',
      );
    return this.toElementsExtractedContent(elementsExtractCheck);
  }
  async extractMakeItArticlePostDatetimeElement(): Promise<ElementExtractedContent> {
    const fieldNameDebug = 'MakeItArticle-post-datetime';
    let elementExtractCheck: ElementExtractCheck<P, T> =
      await this.extractElementStatusCheck(
        this.elements.makeItArticle.postDatetimeElement,
        fieldNameDebug,
      );
    return this.toElementExtractedContent(elementExtractCheck);
  }
  async extractMakeItArticleCategoryElement(): Promise<ElementExtractedContent> {
    const fieldNameDebug = 'MakeItArticle-category';
    let elementExtractCheck: ElementExtractCheck<P, T> =
      await this.extractElementStatusCheck(
        this.elements.makeItArticle.categoryElement,
        fieldNameDebug,
        'href',
      );
    return this.toElementExtractedContent(elementExtractCheck);
  }
  async extractMakeItArticleTitleElement(): Promise<ElementExtractedContent> {
    const fieldNameDebug = 'MakeItArticle-title';
    let elementExtractCheck: ElementExtractCheck<P, T> =
      await this.extractElementStatusCheck(
        this.elements.makeItArticle.articleTitleElement,
        fieldNameDebug,
      );
    return this.toElementExtractedContent(elementExtractCheck);
  }
  async extractMakeItArticleUpdatedDatetimeElement(): Promise<ElementExtractedContent> {
    const fieldNameDebug = 'MakeItArticle-updated-datetime';
    let elementExtractCheck: ElementExtractCheck<P, T> =
      await this.extractElementStatusCheck(
        this.elements.makeItArticle.updatedDatetimeElement,
        fieldNameDebug,
      );
    return this.toElementExtractedContent(elementExtractCheck);
  }
  makeItArticleExtractor = async (): Promise<RawArticlePage> => {
    let content = await this.extractMakeItArticleContentElements();
    let authors = await this.extractMakeItArticleAuthorElement();
    let publishedDatetime =
      await this.extractMakeItArticlePostDatetimeElement();
    let updatedDatetime =
      await this.extractMakeItArticleUpdatedDatetimeElement();
    let category = await this.extractMakeItArticleCategoryElement();
    let title = await this.extractMakeItArticleTitleElement();
    let otherLinks: OtherLinks = await this.getOtherLinks();
    return {
      content_elements: content.eleHTML,
      author_elements: authors.eleHTML,
      article_published_datetime_element: publishedDatetime.eleHTML,
      article_updated_datetime_element: updatedDatetime.eleHTML,
      article_title_element: title.eleHTML,
      category_element: category.eleHTML,
      content: content.textContent,
      authors: authors.textContent,
      article_published_datetime: publishedDatetime.textContent,
      article_updated_datetime: updatedDatetime.textContent,
      article_title: title.textContent,
      category: category.textContent,
      other_article_links: otherLinks.news,
      other_links: otherLinks.other,
      ...(await this.getDefaultRawArticlePage()),
    };
  };
  async extractSelectArticleContentElements(): Promise<ElementsExtractedContent> {
    const fieldNameDebug = 'SelectArticle-article-content';
    let elementsExtractCheck: ElementExtractCheck<P, T>[] =
      await this.extractElementsStatusCheck(
        this.elements.selectArticle.contentElements,
        fieldNameDebug,
      );
    return this.toElementsExtractedContent(elementsExtractCheck);
  }
  async extractSelectArticleAuthorElement(): Promise<ElementsExtractedContent> {
    const fieldNameDebug = 'SelectArticle-author-info';
    let elementsExtractCheck: ElementExtractCheck<P, T>[] =
      await this.extractElementsStatusCheck(
        this.elements.selectArticle.authorElement,
        fieldNameDebug,
        'href',
      );
    return this.toElementsExtractedContent(elementsExtractCheck);
  }
  async extractSelectArticlePostDatetimeElement(): Promise<ElementExtractedContent> {
    const fieldNameDebug = 'SelectArticle-post-datetime';
    let elementExtractCheck: ElementExtractCheck<P, T> =
      await this.extractElementStatusCheck(
        this.elements.selectArticle.postDatetimeElement,
        fieldNameDebug,
      );
    return this.toElementExtractedContent(elementExtractCheck);
  }
  async extractSelectArticleCategoryElement(): Promise<ElementExtractedContent> {
    const fieldNameDebug = 'SelectArticle-category';
    let elementExtractCheck: ElementExtractCheck<P, T> =
      await this.extractElementStatusCheck(
        this.elements.selectArticle.categoryElement,
        fieldNameDebug,
        'href',
      );
    return this.toElementExtractedContent(elementExtractCheck);
  }
  async extractSelectArticleTitleElement(): Promise<ElementExtractedContent> {
    const fieldNameDebug = 'SelectArticle-title';
    let elementExtractCheck: ElementExtractCheck<P, T> =
      await this.extractElementStatusCheck(
        this.elements.selectArticle.articleTitleElement,
        fieldNameDebug,
      );
    return this.toElementExtractedContent(elementExtractCheck);
  }
  selectArticleExtractor = async (): Promise<RawArticlePage> => {
    let content = await this.extractSelectArticleContentElements();
    let authors = await this.extractSelectArticleAuthorElement();
    let publishedDatetime =
      await this.extractSelectArticlePostDatetimeElement();
    let category = await this.extractSelectArticleCategoryElement();
    let title = await this.extractSelectArticleTitleElement();
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
