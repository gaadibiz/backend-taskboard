CREATE OR REPLACE VIEW latest_product AS
SELECT
    p.*
FROM
    products p
    INNER JOIN (
        SELECT
            max(product_id) AS product_id,
            product_uuid
        FROM
            products
        GROUP BY
            product_uuid
    ) AS latest_product ON p.product_id = latest_product.product_id
ORDER BY
    insert_ts DESC;