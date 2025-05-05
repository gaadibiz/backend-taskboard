create or replace view latest_vendor_expense as
select ft.*
from vendor_expense ft
    INNER join (
        select max(vendor_expense_id) as vendor_expense_id, vendor_expense_uuid
        from vendor_expense
        group by
            vendor_expense_uuid
    ) sc on ft.vendor_expense_id = sc.vendor_expense_id;