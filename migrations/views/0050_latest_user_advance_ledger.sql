create
or replace view latest_user_advance_ledger as
select
    ft.*
from
    user_advance_ledger ft
    INNER join (
        select
            max(user_advance_ledger_id) as user_advance_ledger_id,
            user_advance_ledger_uuid
        from
            user_advance_ledger
        group by
            user_advance_ledger_uuid
    ) sc on ft.user_advance_ledger_id = sc.user_advance_ledger_id;