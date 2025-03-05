import { DateTime } from 'luxon';
import { RawArticlePage } from './PuppetAct/ArticlesAct/schemas.js';
import prisma from './db/client.js';
import { BaseWatcher } from './PuppetShow/TheWatcher/BaseWatcher.js';

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message; // Extract the message from an Error object
  }
  return String(error); // Convert other types (e.g., string, number) to string
}

async function pushDataToDB(data: RawArticlePage, watcher?: BaseWatcher) {
  try {
    await prisma.raw_article_pages.create({
      data: {
        url: data.url,
        page_title: data.page_title,
        article_title_element: data.article_title_element,
        content_elements: data.content_elements || [],
        author_elements: data.author_elements || [],
        article_published_datetime_element: data.article_published_datetime_element,
        article_updated_datetime_element: data.article_updated_datetime_element,
        tag_elements: data.tag_elements || [],
        tags: data.tags || [],
        category_element: data.category_element,
        article_title: data.article_title,
        content: data.content || [],
        author: data.authors || [], // Note the field name difference
        article_published_datetime: data.article_published_datetime,
        article_updated_datetime: data.article_updated_datetime,
        category: data.category,
        other_article_links: data.other_article_links || [],
        other_links: data.other_links || [],
        scrape_status: data.scrape_status,
        scraped_at: (data.scraped_at ?? DateTime.now()).toISO(),
        // Timestamps will be set automatically
      },
    });
  } catch (error) {
    if (watcher) {
      watcher.error({
        msg: `Failed to store article in database: ${getErrorMessage(error)}`,
        err: error as Error,
      });
    } else {
      console.error('Failed to store article in database:', getErrorMessage(error));
    }
  }
}

export { getErrorMessage, pushDataToDB };
