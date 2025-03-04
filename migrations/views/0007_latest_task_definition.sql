create or replace view latest_task_definition as
select ft.*
from `task_definition` ft
    INNER join (
        select
            max(task_definition_id) as task_definition_id,
            task_definition_uuid
        from `task_definition`
        group by task_definition_uuid

    ) sc on ft.task_definition_id = sc.task_definition_id;
