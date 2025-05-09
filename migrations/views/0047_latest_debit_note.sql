-- Active: 1729315865592@@159.203.30.12@3306@inventory_db
create or replace view latest_debit_note as
select ft.*,
concat('DN/24-25/', ft.debit_note_no) as combined_debit_note_no
from debit_note ft
    INNER join (
        select
            max(debit_note_id) as debit_note_id,
            debit_note_uuid
        from debit_note
        group by debit_note_uuid
    ) sc on ft.debit_note_id = sc.debit_note_id;