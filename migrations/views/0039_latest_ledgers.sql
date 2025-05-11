CREATE OR REPLACE VIEW latest_ledger AS
SELECT
    l.*
FROM
    ledgers l
    INNER JOIN (
        SELECT
            MAX(ledger_id) AS ledger_id,
            ledger_uuid,invoice_uuid,`status`
        FROM
            ledgers
        GROUP BY
            ledger_uuid,invoice_uuid,`status`
    ) AS latest_ledger ON l.ledger_id = latest_ledger.ledger_id
ORDER BY
    insert_ts DESC;