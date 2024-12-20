create or replace view latest_dynamic_approval_count as
select ft.*
from
    dynamic_approval_count ft
    INNER join (
        select
            max(dynamic_approval_count_id) as dynamic_approval_count_id,
            dynamic_approval_count_uuid
        from dynamic_approval_count
        group by
            dynamic_approval_count_uuid
    ) sc on ft.dynamic_approval_count_id = sc.dynamic_approval_count_id;