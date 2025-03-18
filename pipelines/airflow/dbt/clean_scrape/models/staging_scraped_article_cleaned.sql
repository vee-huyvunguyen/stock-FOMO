with cleaned_other_datetime as (
    select
        id,
        case when lower(article_published_datetime) like '%ago%' 
            then  (regexp_match(article_published_datetime, '(\d+)'))[1]::integer AS first_number
            else null
            end as number_ago,
        case when lower(article_published_datetime) like '%ago%'
            then  (regexp_match(article_published_datetime, '(\d+)'))[1]::integer AS first_number
            else null
        end as minutes_ago_rate,
        article_published_datetime,
        scraped_at
    from {{ ref('raw_articles_validated') }}
), published_dt_minutes_ago as (
    select 
        id,
        (
            scraped_at
            - {{ regex_first_num('article_published_datetime') }}
            * {{ minutes_scale_rate('article_published_datetime') }}
            * interval '1 minute'
        ) as article_published_datetime
    from {{ ref('raw_articles_validated') }} rv
        where lower(rv.article_published_datetime) like '%ago%' 
), updated_dt_minutes_ago as (
    select 
        id,
        (
            scraped_at
            - {{ regex_first_num('article_updated_datetime') }}
            * {{ minutes_scale_rate('article_updated_datetime') }}
            * interval '1 minute'
        ) as article_updated_datetime
    from {{ ref('raw_articles_validated') }} rv
        where lower(rv.article_updated_datetime) like '%ago%' 
)




select 
    id,
    url,
    page_title,
    tags,
    article_title,
    author,
    category,
    scraped_at,
    inserted_at,

    -- resolve the below columns
    -- Concatenate non-empty content array elements with newline characters
    -- First filter out empty strings, then join the remaining elements
    array_to_string(
        array(
            select elem 
            from unnest(content) as elem
            where elem is not null and length(trim(elem)) > 0
        ), 
        E'\n'
    ) as content,
    {{ clean_datetime('article_published_datetime', 'scraped_at') }} as article_published_datetime,
    case when article_updated_datetime is null then null
        else {{ clean_datetime('article_updated_datetime', 'scraped_at') }}
    end as article_updated_datetime,
    other_article_links,
    other_links
from {{ ref('raw_articles_news') }}
