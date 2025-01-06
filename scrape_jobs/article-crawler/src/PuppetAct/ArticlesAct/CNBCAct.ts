import { ActResult, ArticleAct } from ".";
import { ScrapeMaster } from "../../PuppetShow/ScrapeMaster";
import { getErrorMessage } from "../../utils";
import { ScrapeStatus, RawNewsPage } from "./schemas";

class CNBCAct implements ArticleAct {
    private _scrapeStatus: ScrapeStatus ;
    constructor(
        public scrapeMaster: ScrapeMaster,
        public articleURL: string,

    ) {
        this.scrapeMaster = scrapeMaster
        this.articleURL = articleURL
        this._scrapeStatus = {success: true, failReport: undefined}
    }
    async loadNewsPage(): Promise<boolean> {
        try{
            await this.scrapeMaster.goto(this.articleURL)
        }catch(err){
            this._scrapeStatus.success=false
            this._scrapeStatus.failReport={
                failStep: "load-page",
                loadPageError: getErrorMessage(err)
            }
            return false
        }
        return true
    }
    async checkLoadedPage(): Promise<true> {
        throw new Error("Method not implemented.");
    }
    async checkIsNewsPage(): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    getOtherNewsLinks(): string[] {
        throw new Error("Method not implemented.");
    }
    getOtherLinks(): string[] {
        throw new Error("Method not implemented.");
    }
    async getScrapeStatus(): Promise<string> {
        throw new Error("Method not implemented.");
    }
    async getNewsInfo(): Promise<RawNewsPage> {
        throw new Error("Method not implemented.");
    }
    async scrape(): Promise<ActResult> {
        throw new Error("Method not implemented.");
    }

}

export default CNBCAct