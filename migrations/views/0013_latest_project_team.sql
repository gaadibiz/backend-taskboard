create or replace view latest_project_team as
select ft.*
from project_team ft
    INNER join (
        select
            max(project_team_id) as project_team_id, project_team_uuid
        from project_team
        group by
            project_team_uuid
    ) sc on ft.project_team_id = sc.project_team_id;