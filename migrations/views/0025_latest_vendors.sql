create or replace view latest_vendors as
select ft.*
from vendors ft
    INNER join (
        select
            max(vendor_id) as vendor_id,
            vendor_uuid
        from vendors
        group by vendor_uuid
    ) sc on ft.vendor_id = sc.vendor_id;