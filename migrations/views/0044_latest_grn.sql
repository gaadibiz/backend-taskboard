CREATE OR REPLACE VIEW latest_grn AS
SELECT
    qt.*,
    concat('GRN/24-25/', qt.grn_no) AS combined_grn_no
FROM
    `grn` qt
    INNER JOIN (
        SELECT
            MAX(grn_id) AS grn_id,
            grn_uuid
        FROM
            `grn`
        GROUP BY
            grn_uuid
    ) AS latest_grn ON qt.grn_id = latest_grn.grn_id
ORDER BY
    create_ts DESC;