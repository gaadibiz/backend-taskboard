CREATE OR REPLACE VIEW latest_dynamic_approval_attachment AS
SELECT
    p.*
FROM
    dynamic_approval_attachment p
    INNER JOIN (
        SELECT
            max(dynamic_approval_attachment_id) AS dynamic_approval_attachment_id,
            dynamic_approval_attachment_uuid
        FROM
            dynamic_approval_attachment
        GROUP BY
            dynamic_approval_attachment_uuid
    ) AS latest_dynamic_approval_attachment ON p.dynamic_approval_attachment_id = latest_dynamic_approval_attachment.dynamic_approval_attachment_id
ORDER BY
    insert_ts DESC;