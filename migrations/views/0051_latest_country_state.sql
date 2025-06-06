CREATE OR REPLACE VIEW latest_country_state AS
SELECT
    p.*
FROM
    country_state p
    INNER JOIN (
        SELECT
            max(country_state_id) AS country_state_id,
            country_state_uuid
        FROM
            country_state
        GROUP BY
            country_state_uuid
    ) AS latest_country_state ON p.country_state_id = latest_country_state.country_state_id
ORDER BY
    insert_ts DESC;