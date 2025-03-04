create or replace view latest_contacts as
select ft.*
from contacts ft
    INNER join (
        select
            max(contact_id) as contact_id,
            contact_uuid
        from contacts
        group by contact_uuid
    ) sc on ft.contact_id = sc.contact_id;