create or replace view latest_customer_branch as
select ft.*
from customer_branch ft
    INNER join (
        select
            max(customer_branch_id) as customer_branch_id,
            customer_branch_uuid
        from customer_branch
        group by customer_branch_uuid
    ) sc on ft.customer_branch_id = sc.customer_branch_id;