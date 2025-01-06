import { ScrapeMaster } from "../../PuppetShow/ScrapeMaster";
import { RawNewsPage, ScrapeStatus } from "./schemas";


type ActResult = {
    rawNewsPage: RawNewsPage
    otherNewsLinks: string[]
}


interface ArticleAct {
    scrapeMaster: ScrapeMaster
    articleURL: string
    _scrapeStatus: ScrapeStatus
    loadNewsPage(): Promise<boolean>
    checkLoadedPage(): Promise<true>

    checkIsNewsPage(): Promise<boolean>
    getOtherNewsLinks(): string[]
    getOtherLinks(): string[]
    getScrapeStatus(): Promise<string>

    getNewsInfo(): Promise<RawNewsPage>
    scrape(): Promise<ActResult>
}

export {ArticleAct, ActResult}

