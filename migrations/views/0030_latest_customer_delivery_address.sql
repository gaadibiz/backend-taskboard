create or replace view latest_customer_delivery_address as
select ft.*
from customer_delivery_address ft
    INNER join (
        select
            max(customer_delivery_address_id) as customer_delivery_address_id,
            customer_delivery_address_uuid
        from customer_delivery_address
        group by customer_delivery_address_uuid
    ) sc on ft.customer_delivery_address_id = sc.customer_delivery_address_id;