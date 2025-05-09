create or replace view latest_billing_company as
select ft.*
from billing_company ft
    INNER join (
        select
            max(billing_company_id) as billing_company_id,
            billing_company_uuid
        from billing_company
        group by billing_company_uuid
    ) sc on ft.billing_company_id = sc.billing_company_id;