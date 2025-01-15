import { ArticleInfoExtractor, OtherLinks } from '../..';
import { ScrapeMaster } from '../../../../PuppetShow/ScrapeMaster';
import { TypeCNBCActCSSselector } from '../../../CSSselectors';
import { RawArticlePage, ScrapeStatusHandler } from '../../schemas';
import { DateTime } from 'luxon';
import {
  ElementHTML,
  ElementTextContent,
  ScrapedElement,
} from '../../../../PuppetShow/ScrapedElement';
import { getErrorMessage } from '../../../../utils';
import { isEmpty } from 'lodash';

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
    [ElementHTML[]|undefined, ElementTextContent[]|undefined]
  > {
    const fieldNameDebug = "article-content"
    let contentEles
    try{
      contentEles = await this.scrapeMaster.selectElements(this.elements.mainArticle.contentElements, undefined, fieldNameDebug)
    }catch (err){
      this.statusHandler.addFieldsFailedToScrape([fieldNameDebug, getErrorMessage(err)])
      return [[], []]
    }
    let contents: ElementTextContent[] = []
    let contentsElesHTML: ElementHTML[] = []
    for (const ele of contentEles){
      try{
        const tmpContent = await ele.text()
        if (!tmpContent){continue}
        contents.push(tmpContent)
      }catch(err){
        this.statusHandler.addFieldsFailedToScrape([fieldNameDebug,getErrorMessage(err)])
        try{
          contentsElesHTML.push(await ele.getOuterHTML())
        }catch{}
      }
    }
    return [contentsElesHTML, contents]
  }
  async extractAuthorElement(): Promise<[ElementHTML|undefined, ElementTextContent|undefined]> {
    const fieldNameDebug = "author-info"
    let authorEle: ScrapedElement|undefined
    let author = undefined
    let authorHTML = undefined
    let error = undefined
    try{
      authorEle = await this.scrapeMaster.selectElement(this.elements.mainArticle.authorElement, undefined, fieldNameDebug)
      if (!authorEle) {
        this.statusHandler.addFieldsFailedToScrape([fieldNameDebug, "undefined"])
        return [undefined, undefined]
      }else{
        try{
          author = await authorEle.text()
        }catch(err){error = err}
      }
    }catch(err){error = err}
    if (error){
      this.statusHandler.addFieldsFailedToScrape([fieldNameDebug,getErrorMessage(error)])
      try{
        authorHTML = await (authorEle as ScrapedElement).getOuterHTML()
      }catch{}
    }
    return [authorHTML, author]
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
