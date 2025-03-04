create or replace view latest_job as
select ft.*
from job ft
    INNER join (
        select max(job_id) as job_id, job_uuid
        from job
        group by
            job_uuid
    ) sc on ft.job_id = sc.job_id;