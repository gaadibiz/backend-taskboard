create or replace view latest_customer_dispatch_address as
select ft.*
from customer_dispatch_address ft
    INNER join (
        select
            max(customer_dispatch_address_id) as customer_dispatch_address_id,
            customer_dispatch_address_uuid
        from customer_dispatch_address
        group by customer_dispatch_address_uuid
    ) sc on ft.customer_dispatch_address_id = sc.customer_dispatch_address_id;