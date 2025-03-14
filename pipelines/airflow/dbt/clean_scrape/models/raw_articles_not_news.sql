select *
from {{ ref('raw_articles_validated') }} rv
where rv.id not in(
    select id from
    {{ ref('raw_articles_news') }}
)