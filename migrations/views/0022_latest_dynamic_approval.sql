create or replace view latest_dynamic_approval as
select ft.*
from dynamic_approval ft
    INNER join (
        select
            max(dynamic_approval_id) as dynamic_approval_id, dynamic_approval_uuid, record_uuid
        from dynamic_approval
        group by
            dynamic_approval_uuid, record_uuid
    ) sc on ft.dynamic_approval_id = sc.dynamic_approval_id;