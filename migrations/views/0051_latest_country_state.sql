CREATE OR REPLACE VIEW latest_country_state
AS
SELECT ft.*
FROM country_state AS ft
LEFT JOIN country_state AS rt 
  ON ft.country_state_unique_id = rt.country_state_unique_id 
  AND ft.country_state_id < rt.country_state_id
WHERE rt.country_state_id IS NULL
ORDER BY  insert_ts DESC;