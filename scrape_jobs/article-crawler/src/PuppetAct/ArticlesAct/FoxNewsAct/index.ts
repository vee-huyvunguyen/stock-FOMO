import { ScrapeMaster } from "@/PuppetShow/ScrapeMaster";
import { ArticleAct, ArticleInfoExtractor, OtherLinks } from "@/PuppetAct/ArticlesAct";
import { TypeBaseCSSSelector } from "@/PuppetAct/ActConfig/CSSselectors";
import { PageType } from "@/PuppetAct/ActConfig/CSSselectors";
import { RawArticlePage } from "@/PuppetAct/ArticlesAct/schemas";
import { ElementsExtractedContent } from "@/PuppetAct/ArticlesAct";
import { ArticleActConfig } from "@/PuppetAct/ActConfig";

export default class FoxNewsAct<P, T> extends ArticleAct<P, T> {
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
            fieldNameDebug
        );
        return this.toElementsExtractedContent(elementsExtractCheck);
    }

    getInfoExtractor(pageType: keyof TypeBaseCSSSelector): ArticleInfoExtractor {
        let extractors: Record<keyof TypeBaseCSSSelector, ArticleInfoExtractor> = {
            mainArticle: this.mainArticleExtractor,
            businessArticle: this.businessArticleExtractor,
            outkickArticle: this.outkickArticleExtractor,
            weatherArticle: this.weatherArticleExtractor,
          };
          return extractors[pageType];
    }

    businessArticleExtractor = async (): Promise<RawArticlePage> => {
        throw new Error("Not implemented")
    }
    outkickArticleExtractor = async (): Promise<RawArticlePage> => {
        throw new Error("Not implemented")
    }
    weatherArticleExtractor = async (): Promise<RawArticlePage> => {
        throw new Error("Not implemented")
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
