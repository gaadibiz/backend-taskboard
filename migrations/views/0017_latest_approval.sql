create or replace view latest_approval as
select ft.*
from approval ft
    INNER join (
        select max(approval_id) as approval_id, approval_uuid
        from approval
        group by
            approval_uuid
    ) sc on ft.approval_id = sc.approval_id;