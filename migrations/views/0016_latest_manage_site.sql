create or replace view latest_manage_site as
select ft.*
from manage_site ft
    INNER join (
        select
            max(manage_site_id) as manage_site_id,
            manage_site_uuid
        from manage_site
        group by manage_site_uuid
    ) sc on ft.manage_site_id = sc.manage_site_id;