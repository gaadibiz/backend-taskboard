CREATE OR REPLACE VIEW latest_invoices AS
SELECT
    qt.*,
    COALESCE(CONCAT(lcb.invoice_no_sequence,COALESCE(CONCAT(qt.invoice_no, qt.invoice_no_aux), qt.invoice_no)),COALESCE(CONCAT(qt.invoice_no, qt.invoice_no_aux), qt.invoice_no)) AS combined_invoice_no
FROM
    `invoices` qt
    INNER JOIN (
        SELECT
            MAX(invoice_id) AS invoice_id,
            invoice_uuid
        FROM
            `invoices`
        GROUP BY
            invoice_uuid
    ) AS latest_invoices ON qt.invoice_id = latest_invoices.invoice_id
    left join latest_customer_branch lcb on qt.billing_company_branch_uuid=lcb.customer_branch_uuid
ORDER BY
    create_ts DESC;