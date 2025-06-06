CREATE OR REPLACE VIEW latest_expense_draft AS
SELECT
    p.*
FROM
    expense_draft p
    INNER JOIN (
        SELECT
            max(draft_id) AS draft_id,
            draft_uuid
        FROM
            expense_draft
        GROUP BY
            draft_uuid
    ) AS latest_expense_draft ON p.draft_id = latest_expense_draft.draft_id
ORDER BY
    insert_ts DESC;