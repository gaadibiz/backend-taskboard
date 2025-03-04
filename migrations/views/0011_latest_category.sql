create or replace view latest_category as
select ft.*
from category ft
    INNER join (
        select
            max(category_id) as category_id,
            category_uuid
        from category
        group by category_uuid
    ) sc on ft.category_id = sc.category_id;