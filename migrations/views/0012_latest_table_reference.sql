CREATE or REPLACE VIEW latest_table_reference AS
select ft.*
from table_reference ft
    INNER join (
        select
            max(table_reference_id) as table_reference_id, table_reference_unique_id
        from table_reference
        group by
            table_reference_unique_id
    ) sub on ft.table_reference_id = sub.table_reference_id
order by ft.table_reference_id desc;