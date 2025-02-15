import { ScrapeMaster } from '@/PuppetShow/ScrapeMaster';
import {
  ArticleAct,
  ArticleInfoExtractor,
  OtherLinks,
} from '@/PuppetAct/ArticlesAct';
import { TypeBaseCSSSelector } from '@/PuppetAct/ActConfig/CSSselectors';
import { PageType } from '@/PuppetAct/ActConfig/CSSselectors';
import { RawArticlePage } from '@/PuppetAct/ArticlesAct/schemas';
import { ElementsExtractedContent } from '@/PuppetAct/ArticlesAct';
import { ArticleActConfig } from '@/PuppetAct/ActConfig';

export default class ReutersAct<P, T> extends ArticleAct<P, T> {
  constructor(
    scrapeMaster: ScrapeMaster<P, T>,
    articleURL: string,
    actConfig: ArticleActConfig,
    manualPageType?: string,
  ) {
    super(scrapeMaster, articleURL, actConfig, manualPageType);
  }

  checkURLIsNewsPage(url: string, pageType: PageType): boolean {
    throw new Error('Method not implemented.');
  }

  async extractArticleContentElements(): Promise<ElementsExtractedContent> {
    const fieldNameDebug = 'Article-content';
    let elementsExtractCheck = await this.extractElementsStatusCheck(
      this.elements.mainArticle.contentElements,
      fieldNameDebug,
    );
    return this.toElementsExtractedContent(elementsExtractCheck);
  }

  // Similar extraction methods for other elements...
  // Implementing only core methods to keep response concise

  getInfoExtractor(pageType: keyof TypeBaseCSSSelector): ArticleInfoExtractor {
    throw new Error('Method not implemented.');
  }

  mainArticleExtractor = async (): Promise<RawArticlePage> => {
    let content = await this.extractArticleContentElements();
    let otherLinks: OtherLinks = await this.getOtherLinks();

    return {
      content_elements: content.eleHTML,
      content: content.textContent,
      other_article_links: otherLinks.news,
      other_links: otherLinks.other,
      ...(await this.getDefaultRawArticlePage()),
    };
  };
}
