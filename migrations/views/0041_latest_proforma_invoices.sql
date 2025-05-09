-- Active: 1703913639497@@159.203.30.12@3306@inventory_db
CREATE OR REPLACE VIEW latest_proforma_invoices AS
SELECT
    qt.*,
    concat('PI/24-25/', qt.proforma_invoice_no) AS combined_proforma_invoice_no
FROM
    `proforma_invoice` qt
    INNER JOIN (
        SELECT
            MAX(proforma_invoice_id) AS proforma_invoice_id,
            proforma_invoice_uuid
        FROM
            `proforma_invoice`
        GROUP BY
            proforma_invoice_uuid
    ) AS latest_proforma_invoices ON qt.proforma_invoice_id = latest_proforma_invoices.proforma_invoice_id
ORDER BY
    create_ts DESC;