create or replace view latest_project_with_team as
SELECT p.*, t.user_uuid as user_uuid
FROM
    latest_project p
    left JOIN latest_project_team t ON p.project_uuid = t.project_uuid;