{% macro regex_first_num(dt_str_col) %}
    (regexp_match({{ dt_str_col }}, '(\d+)'))[1]::integer
{% endmacro %}