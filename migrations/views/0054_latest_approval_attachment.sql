CREATE OR REPLACE VIEW latest_approval_attachment AS
SELECT
    p.*
FROM
    approval_attachment p
    INNER JOIN (
        SELECT
            max(approval_attachment_id) AS approval_attachment_id,
            approval_attachment_uuid
        FROM
            approval_attachment
        GROUP BY
            approval_attachment_uuid
    ) AS latest_approval_attachment ON p.approval_attachment_id = latest_approval_attachment.approval_attachment_id
ORDER BY
    insert_ts DESC;