create or replace view latest_user_dim as
select ft.*
from `user_dim` ft
    INNER join (
        select max(user_dim_id) as user_dim_id, user_uuid
        from `user_dim`
        group by
            user_uuid
    ) sc on ft.user_uuid = sc.user_uuid;