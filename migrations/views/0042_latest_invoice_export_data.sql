create or replace view latest_invoice_export_data as
select ft.*
from invoice_export_data ft
    INNER join (
        select
            max(invoice_export_data_id) as invoice_export_data_id,
            invoice_export_data_uuid
        from invoice_export_data
        group by invoice_export_data_uuid
    ) sc on ft.invoice_export_data_id = sc.invoice_export_data_id;