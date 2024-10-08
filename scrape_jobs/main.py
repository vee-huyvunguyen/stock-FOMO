import asyncio

# Instead of BeautifulSoupCrawler let's use Playwright to be able to render JavaScript.
from crawlee.playwright_crawler import PlaywrightCrawler, PlaywrightCrawlingContext
from crawlee.storages import Dataset


async def main() -> None:
    crawler = PlaywrightCrawler(max_requests_per_crawl=10)
    dataset = await Dataset.open(name="shokai")
    
    @crawler.router.default_handler
    async def request_handler(context: PlaywrightCrawlingContext) -> None:

        url = context.request.url
        title = await context.page.title()
        context.log.info(f'The title of {url} is: {title}.')
        await dataset.push_data({
            "title": title,
            "url": url
        })
        await context.enqueue_links()


    await crawler.run(['https://shopee.vn/Đồ-bộ-thể-thao-nam-mặc-hè-xuyên-biên-giới-Chất-thun-cotton-thấm-hút-mồ-hôi-cực-tốt-Kiểu-dáng-Slim-Fit-siêu-đẹp-DB37-i.235157499.15868812301'])


if __name__ == '__main__':
    asyncio.run(main())