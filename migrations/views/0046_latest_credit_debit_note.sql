create or replace view latest_credit_debit_note as
select ft.*,
concat('CN/24-25/', ft.credit_debit_note_no) as combined_credit_debit_note_no
from credit_debit_note ft
    INNER join (
        select
            max(credit_debit_note_id) as credit_debit_note_id,
            credit_debit_note_uuid
        from credit_debit_note
        group by credit_debit_note_uuid
    ) sc on ft.credit_debit_note_id = sc.credit_debit_note_id;