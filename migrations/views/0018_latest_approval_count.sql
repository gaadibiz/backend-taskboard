create or replace view latest_approval_count as
select ft.*
from approval_count ft
    INNER join (
        select
            max(approval_count_id) as approval_count_id, approval_count_uuid
        from approval_count
        group by
            approval_count_uuid
    ) sc on ft.approval_count_id = sc.approval_count_id;