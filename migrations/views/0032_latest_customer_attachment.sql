create or replace view latest_customer_attachment as
select ft.*
from customer_attachment ft
    INNER join (
        select
            max(customer_attachment_id) as customer_attachment_id,
            customer_attachment_uuid
        from customer_attachment
        group by customer_attachment_uuid
    ) sc on ft.customer_attachment_id = sc.customer_attachment_id;