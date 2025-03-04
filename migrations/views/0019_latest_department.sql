create or replace view latest_department as
select ft.*
from department ft
    INNER join (
        select
            max(department_id) as department_id, department_uuid
        from department
        group by
            department_uuid
    ) sc on ft.department_id = sc.department_id;