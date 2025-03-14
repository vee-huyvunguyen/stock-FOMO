select 
    id,
    url,
    page_title,
    tags,
    article_title,
    author,
    category,
    scraped_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    inserted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP

    -- resolve the below columns
    content,
    article_published_datetime,
    article_updated_datetime,
    other_article_links,
    other_links,
from {{ ref('raw_articles_news') }}
