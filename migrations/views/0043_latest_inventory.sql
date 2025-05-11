-- Active: 1711945541933@@139.59.14.80@3306@inventorywesourcebe
CREATE OR REPLACE VIEW latest_inventory AS
SELECT
    inv.*
FROM
    inventory inv
    INNER JOIN (
        SELECT
            MAX(inventory_id) AS inventory_id,
            inventory_uuid
        FROM
            inventory
        GROUP BY
            inventory_uuid
    ) AS latest_inventory ON inv.inventory_id = latest_inventory.inventory_id
ORDER BY
    inv.dated DESC;