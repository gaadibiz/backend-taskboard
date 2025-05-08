create or replace view latest_vendor_expense_category as
select ft.*
from vendor_expense_category ft
    INNER join (
        select max(vendor_expense_category_id) as vendor_expense_category_id, vendor_expense_category_uuid
        from vendor_expense_category
        group by
            vendor_expense_category_uuid
    ) sc on ft.vendor_expense_category_id = sc.vendor_expense_category_id;