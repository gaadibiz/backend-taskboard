DROP VIEW IF EXISTS latest_module;
CREATE VIEW latest_module
AS
SELECT pccp.*, module_name, submodule_name, table_name
FROM role_module AS pccp
JOIN (
  SELECT MAX(role_module_id) AS role_module_id, role_module_uuid
  FROM role_module
  GROUP BY role_module_uuid
) AS subquery ON pccp.role_module_id = subquery.role_module_id
INNER join `module` on `module`.module_uuid = pccp.module_uuid