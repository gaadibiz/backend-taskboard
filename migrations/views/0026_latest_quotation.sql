CREATE OR REPLACE VIEW latest_quotation AS
SELECT
    qt.*,
    concat('QU/24-24/', qt.quotation_no) AS combined_quotation_no
FROM
    `quotation` qt
    INNER JOIN (
        SELECT
            MAX(quotation_id) AS quotation_id,
            quotation_uuid
        FROM
            `quotation`
        GROUP BY
            quotation_uuid
    ) AS latest_quotation ON qt.quotation_id = latest_quotation.quotation_id
ORDER BY
    create_ts DESC;