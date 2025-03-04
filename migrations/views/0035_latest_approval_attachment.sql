create or replace view latest_approval_attachment as
select ft.*
from approval_attachment ft
    INNER join (
        select
            max(approval_attachment_id) as approval_attachment_id,
            approval_attachment_uuid
        from approval_attachment
        group by approval_attachment_uuid
    ) sc on ft.approval_attachment_id = sc.approval_attachment_id;