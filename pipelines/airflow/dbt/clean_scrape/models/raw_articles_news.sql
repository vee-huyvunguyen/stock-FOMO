select * from {{ ref('raw_articles_validated') }}
where
    jsonb_extract_path_text(scrape_status, 'success') = 'true'
    or
    (
        article_published_datetime is not null
        or article_updated_datetime is not null
        or array_length(tags, 1) > 0
        or array_length("content", 1) > 0
        or array_length(author, 1) > 0
        or article_title is not NULL
        or category is not NULL
    )