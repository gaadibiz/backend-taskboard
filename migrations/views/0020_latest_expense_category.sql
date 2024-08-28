create or replace view latest_expense_category as
select ft.*
from expense_category ft
    INNER join (
        select
            max(expense_category_id) as expense_category_id, expense_category_uuid
        from expense_category
        group by
            expense_category_uuid
    ) sc on ft.expense_category_id = sc.expense_category_id;