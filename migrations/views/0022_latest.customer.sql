create or replace view latest_customer as
select ft.*
from customer ft
    INNER join (
        select
            max(customer_id) as customer_id,
            customer_uuid
        from customer
        group by customer_uuid
    ) sc on ft.customer_id = sc.customer_id;