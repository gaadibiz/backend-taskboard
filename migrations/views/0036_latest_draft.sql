CREATE OR REPLACE VIEW latest_draft AS
SELECT cat.*
FROM draft cat
INNER JOIN(
    SELECT MAX(draft_id) AS draft_id,
    draft_uuid , draft_code AS draft_code
    FROM draft
    GROUP BY draft_uuid, draft_code
) AS latest_draft
ON cat.draft_code = latest_draft.draft_code AND cat.draft_id= latest_draft.draft_id
ORDER BY insert_ts DESC;