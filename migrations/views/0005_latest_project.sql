create or replace view latest_project as
select ft.*
from project ft
    INNER join (
        select
            max(project_id) as project_id,
            project_uuid
        from project
        group by project_uuid
    ) sc on ft.project_id = sc.project_id;