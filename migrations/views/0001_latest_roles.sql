create or replace view latest_roles as
select ft.*
from `roles` ft
    INNER join (
        select
            max(role_id) as role_id,
            role_uuid
        from `roles`
        group by role_uuid
    ) sc on ft.role_id = sc.role_id;