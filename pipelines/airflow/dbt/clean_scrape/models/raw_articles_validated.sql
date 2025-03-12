/*
    This model selects validated articles from the scrape.raw_article_pages table.
    It filters articles where scrape_status->>'validated' = 'true'.
    
    The model is tested for:
    - Not null and unique constraints on id and url
    - Valid URL format
    - Content array having at least 3 elements
    - Valid date formats for article_published_datetime and article_updated_datetime
*/

select 
    "id",
    "url",
    page_title,
    article_title_element,
    content_elements,
    author_elements,
    article_published_datetime_element,
    article_updated_datetime_element,
    tag_elements,
    tags,
    category_element,
    article_title,
    "content",
    author,
    article_published_datetime,
    article_updated_datetime,
    category,
    other_article_links,
    other_links,
    scrape_status,
    scraped_at,
    inserted_at
from scrape.raw_article_pages