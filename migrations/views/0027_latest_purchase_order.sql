CREATE OR REPLACE VIEW latest_purchase_order AS
SELECT
    qt.*,
    concat('PO/24-25/', qt.purchase_order_no) AS combined_purchase_order_no
FROM
    `purchase_order` qt
    INNER JOIN (
        SELECT
            MAX(purchase_order_id) AS purchase_order_id,
            purchase_order_uuid
        FROM
            `purchase_order`
        GROUP BY
            purchase_order_uuid
    ) AS latest_purchase_order ON qt.purchase_order_id = latest_purchase_order.purchase_order_id
ORDER BY
    create_ts DESC;