CREATE OR REPLACE VIEW latest_sale_order AS
SELECT
    qt.*,
    concat('SO/24-24/', qt.sale_order_no) AS combined_sale_order_no
FROM
    `sale_order` qt
    INNER JOIN (
        SELECT
            MAX(sale_order_id) AS sale_order_id,
            sale_order_uuid
        FROM
            `sale_order`
        GROUP BY
            sale_order_uuid
    ) AS latest_sale_order ON qt.sale_order_id = latest_sale_order.sale_order_id
ORDER BY
    create_ts DESC;