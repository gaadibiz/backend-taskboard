create or replace view latest_expense as
select ft.*
from expense ft
    INNER join (
        select max(expense_id) as expense_id, expense_uuid
        from expense
        group by
            expense_uuid
    ) sc on ft.expense_id = sc.expense_id;