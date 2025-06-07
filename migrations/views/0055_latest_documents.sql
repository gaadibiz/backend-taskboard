CREATE OR REPLACE VIEW latest_documents AS
SELECT
    p.*
FROM
    documents p
    INNER JOIN (
        SELECT
            max(documents_id) AS documents_id,
            documents_uuid
        FROM
            documents
        GROUP BY
            documents_uuid
    ) AS latest_documents ON p.documents_id = latest_documents.documents_id
ORDER BY
    insert_ts DESC;