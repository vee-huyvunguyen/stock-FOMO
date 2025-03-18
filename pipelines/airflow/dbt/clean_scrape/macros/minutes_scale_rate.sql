{% macro minutes_scale_rate(dt_str_col) %}
    case when lower({{ dt_str_col }}) like '%minutes%' then 1
        when lower({{ dt_str_col }}) like '%min%' then 1
        when lower({{ dt_str_col }}) like '%hour%' then 60
        when lower({{ dt_str_col }}) like '%day%' then 1440
        else null
    end
{% endmacro %}