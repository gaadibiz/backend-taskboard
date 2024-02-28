create or replace view latest_tasks as
select ft.*
from `tasks` ft
    INNER join (
        select
            max(task_user_taskboard_id) as task_user_taskboard_id,
            task_uuid
        from `tasks`
        group by task_uuid

    ) sc on ft.task_user_taskboard_id = sc.task_user_taskboard_id AND ft.status <> "ARCHIVE";
