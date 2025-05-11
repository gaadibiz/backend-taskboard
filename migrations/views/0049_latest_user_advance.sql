create
or replace view latest_user_advance as
select
    ft.*
from
    user_advance ft
    INNER join (
        select
            max(user_advance_id) as user_advance_id,
            user_advance_uuid
        from
            user_advance
        group by
            user_advance_uuid
    ) sc on ft.user_advance_id = sc.user_advance_id;