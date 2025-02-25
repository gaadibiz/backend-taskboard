create or replace view latest_documents as
select ft.*
from documents ft
    INNER join (
        select
            max(documents_id) as documents_id,
            documents_uuid
        from documents
        group by documents_uuid
    ) sc on ft.documents_id = sc.documents_id;