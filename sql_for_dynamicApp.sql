SELECT
    at.*,
    la.dynamic_approval_uuid,
    la.requested_by_uuid,
    la.status as approval_status
FROM
    latest_dynamic_approval la
    INNER JOIN latest_expense at ON record_uuid = expense_uuid
    and at.status LIKE "%_APPROVAL_REQUESTED"
WHERE
    table_name = 'latest_expense'
    AND (
        JSON_CONTAINS(
            approval_uuids,
            '{"type": "USER", "uuid": "99a08cca-7f07-4740-87f7-96a216355112"}'
        )
        or JSON_CONTAINS(
            approval_uuids,
            '{"type": "ROLE", "uuid": "b957fc58-1367-4d57-a602-8dce179f4c5b"}'
        )
    )
    AND (
        at.created_by_uuid IN (
            select
                user_uuid
            from
                latest_user
            where
                (
                    user_uuid = "99a08cca-7f07-4740-87f7-96a216355112"
                )
        )
        OR at.project_manager_uuid IN (
            select
                user_uuid
            from
                latest_user
            where
                (
                    user_uuid = "99a08cca-7f07-4740-87f7-96a216355112"
                )
        )
        OR at.category_manager_uuid IN (
            select
                user_uuid
            from
                latest_user
            where
                (
                    user_uuid = "99a08cca-7f07-4740-87f7-96a216355112"
                )
        )
        OR at.finance_manager_uuid IN (
            select
                user_uuid
            from
                latest_user
            where
                (
                    user_uuid = "99a08cca-7f07-4740-87f7-96a216355112"
                )
        )
        OR at.modified_by_uuid IN (
            select
                user_uuid
            from
                latest_user
            where
                (
                    user_uuid = "99a08cca-7f07-4740-87f7-96a216355112"
                )
        )
        OR (
            select
                user_uuid
            from
                latest_user
            where
                user_uuid = '99a08cca-7f07-4740-87f7-96a216355112'
        ) = ANY (at.special_approval_uuids)
    )
ORDER BY
    insert_ts DESC
limit
    0, 10;