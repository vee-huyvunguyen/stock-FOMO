import asyncio

from crawlee.playwright_crawler import PlaywrightCrawler, PlaywrightCrawlingContext
from crawlee.storages import Dataset
from crawlee import Glob
from playwright.async_api import Page

async def extract_writing_task_1(page: Page):
    # the elements we want to interact with are present in the DOM.
    # Extracting the content
    task = await page.wait_for_selector(".item-page > p:nth-child(8)")
    graph_description = await page.wait_for_selector(".item-page > h3:nth-child(7)")
    graph_type = await page.wait_for_selector(".item-page > h3:nth-child(5)")
    last_updated = await page.wait_for_selector(".modified")
    hits = await page.wait_for_selector(".hits")
    images = await page.query_selector_all(".item-page p img")

    # Collecting data
    result = {
        "task": await task.inner_text() if task else None,
        "graph_description": await graph_description.inner_text() if graph_description else None,
        "graph_type": await graph_type.inner_text() if graph_type else None,
        "last_updated": await last_updated.inner_text() if last_updated else None,
        "hits": await hits.inner_text() if hits else 0,
        "images_links": [await img.get_property("src") for img in images] if images else None,
    }

    return result


async def main() -> None:
    crawler = PlaywrightCrawler(max_requests_per_crawl=1000)
    dataset = await Dataset.open(name="ielts")
    
    @crawler.router.default_handler
    async def request_handler(context: PlaywrightCrawlingContext) -> None:
        url = context.request.url
        title = await context.page.title()
        context.log.info(f'The title of {url} is: {title}.')
        if "?start=" not in url and len(url) > 68:
            await dataset.push_data(
                await extract_writing_task_1(context.page)
            )
        await context.enqueue_links(
            include=[
                Glob("https://www.ielts-mentor.com/writing-sample/academic-writing-task-1?start=*"),
                Glob("https://www.ielts-mentor.com/writing-sample/academic-writing-task-1/*")
            ]
        )


    await crawler.run(["https://www.ielts-mentor.com/writing-sample/academic-writing-task-1/"])


if __name__ == '__main__':
    asyncio.run(main())