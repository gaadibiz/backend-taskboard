create or replace view latest_report as
select ft.*
from report ft
    INNER join (
        select max(report_id) as report_id, report_uuid
        from report
        group by
            report_uuid
    ) sc on ft.report_id = sc.report_id;