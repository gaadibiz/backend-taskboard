create or replace view latest_zone as
select ft.*
from zone ft
    INNER join (
        select
            max(zone_id) as zone_id,
            zone_uuid
        from zone
        group by zone_uuid
    ) sc on ft.zone_id = sc.zone_id;