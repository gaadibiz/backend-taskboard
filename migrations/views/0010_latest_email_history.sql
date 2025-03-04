create or replace view latest_email_history as
select ft.*
from email_history ft
    INNER join (
        select
            max(email_history_id) as email_history_id,
            email_history_uuid
        from email_history
        group by email_history_uuid
    ) sc on ft.email_history_id = sc.email_history_id;