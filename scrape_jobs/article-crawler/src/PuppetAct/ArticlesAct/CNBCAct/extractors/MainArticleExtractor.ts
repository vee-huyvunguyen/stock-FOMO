import { ArticleInfoExtractor, OtherLinks } from '../..';
import { ScrapeMaster } from '../../../../PuppetShow/ScrapeMaster';
import { TypeCNBCActCSSselector } from '../../../CSSselectors';
import { RawArticlePage, ScrapeStatusHandler } from '../../schemas';
import { DateTime } from 'luxon';
import {
  ElementHTML,
  ElementTextContent,
} from '../../../../PuppetShow/ScrapedElement';

export default class MainArticleExtractor implements ArticleInfoExtractor {
  constructor(
    public scrapeMaster: ScrapeMaster,
    public elements: TypeCNBCActCSSselector,
    public statusHandler: ScrapeStatusHandler,
  ) {
    this.scrapeMaster = scrapeMaster;
    this.elements = elements;
    this.statusHandler = statusHandler;
  }
  async extractContentElements(): Promise<
    [ElementHTML[], ElementTextContent[]]
  > {
    return [];
  }
  async extractAuthorElement(): Promise<[ElementHTML, ElementTextContent]> {
    return [];
  }
  async extractPostDatetimeElement(): Promise<[ElementHTML, DateTime]> {
    return [];
  }
  async extractCategoryElement(): Promise<[ElementHTML, ElementTextContent]> {
    return [];
  }
  async extract(otherLinks: OtherLinks): Promise<RawArticlePage> {
    let [contentEles, content] = await this.extractContentElements();
    let [authorEle, author] = await this.extractAuthorElement();
    let [postDatetimeEle, postDatetime] =
      await this.extractPostDatetimeElement();
    let [categoryEle, category] = await this.extractCategoryElement();

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
      scrape_status: this.statusHandler.scrapeStatus,
      scraped_at: DateTime.now().toUTC(),
      other_article_links: otherLinks.news,
      other_links: otherLinks.other,
    };
  }
}
