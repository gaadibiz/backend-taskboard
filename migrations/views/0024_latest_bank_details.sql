create or replace view latest_bank_details as
select ft.*
from bank_details ft
    INNER join (
        select
            max(bank_details_id) as bank_details_id,
            account_no
        from bank_details
        group by account_no
    ) sc on ft.bank_details_id = sc.bank_details_id;