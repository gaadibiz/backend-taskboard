create or replace view latest_dynamic_approval_attachment as
select ft.*
from dynamic_approval_attachment ft
    INNER join (
        select
            max(dynamic_approval_attachment_id) as dynamic_approval_attachment_id,
            dynamic_approval_attachment_uuid
        from dynamic_approval_attachment
        group by dynamic_approval_attachment_uuid
    ) sc on ft.dynamic_approval_attachment_id = sc.dynamic_approval_attachment_id;