{% test valid_url_format(model, column_name) %}

with validation as (
    select
        *
    from {{ model }}
    where 
        -- Check if URL starts with http:// or https://
        {{ column_name }} !~ '^https?://' 
        -- Check if URL has a valid domain structure
        OR {{ column_name }} !~ '^https?://[a-zA-Z0-9][-a-zA-Z0-9]*(\.[a-zA-Z0-9][-a-zA-Z0-9]*)+' 
        -- Check if URL doesn't have invalid characters
        OR {{ column_name }} ~ '[<>"\s{}|\\^`]'
)

select *
from validation

{% endtest %} 