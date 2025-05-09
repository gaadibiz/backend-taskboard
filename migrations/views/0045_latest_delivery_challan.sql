-- Active: 1703913639497@@159.203.30.12@3306@inventory_db
CREATE OR REPLACE VIEW latest_delivery_challan AS
SELECT
    qt.*,
    concat('DL/DC/24-24/', qt.delivery_challan_no) AS combined_delivery_challan_no
FROM
    `delivery_challan` qt
    INNER JOIN (
        SELECT
            MAX(delivery_challan_id) AS delivery_challan_id,
            delivery_challan_uuid
        FROM
            `delivery_challan`
        GROUP BY
            delivery_challan_uuid
    ) AS latest_delivery_challan ON qt.delivery_challan_id = latest_delivery_challan.delivery_challan_id
ORDER BY
    create_ts DESC;