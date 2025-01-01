CREATE or REPLACE VIEW latest_user AS
select
    uf.user_fact_id,
    uf.user_uuid,
    uf.email,
    up.status,
    uf.created_by_uuid,
    uf.insert_ts,
    lud.user_dim_id,
    lud.user_password,
    lud.role_uuid,
    r.role_name,
    r.role_value,
    r.role_group,
    up.user_profile_id,
    up.first_name,
    up.last_name,
    TRIM(CONCAT(up.first_name, ' ', IFNULL(up.last_name, ''))) AS full_name,
    up.personal_email,
    up.department_name,
    up.department_uuid,
    up.job_title,
    up.manager_uuid,
    up.manager_name,
    up.hierarchy_uuids,
    up.user_type,
    up.assigned_phone_number,
    up.shared_email,
    up.mobile,
    up.home_phone,
    up.linkedin_profile,
    up.hire_date,
    up.last_day_at_work,
    up.department,
    up.fax,
    up.date_of_birth,
    up.mother_maiden_name,
    up.photo,
    up.signature,
    up.street_address,
    up.unit_or_suite,
    up.city,
    up.province_or_state,
    up.postal_code,
    up.country,
    up.languages_known,
    up.documents,
    up.branch_name,
    up.branch_uuid,
    up.father_name,
    up.mother_name,
    up.spouse_name,
    up.father_contact_no,
    up.mother_contact_no,
    up.spouse_contact_no,
    up.bank_name,
    up.bank_account_number,
    up.bank_ifsc_code,
    up.bank_branch,
    up.marital_status,
    up.attachment
from
    user_fact uf
    INNER JOIN (
        select ud.*
        from user_dim ud
            INNER JOIN (
                select max(user_dim_id) as user_dim_id, user_uuid
                from user_dim
                GROUP BY
                    user_uuid
            ) subud on ud.user_dim_id = subud.user_dim_id
    ) as lud on uf.user_uuid = lud.user_uuid
    INNER JOIN latest_roles r on lud.role_uuid = r.role_uuid
    left join (
        select up.*
        from user_profile up
            INNER JOIN (
                select max(user_profile_id) as user_profile_id, user_uuid
                from user_profile
                GROUP BY
                    user_uuid
            ) as up2 on up.user_profile_id = up2.user_profile_id
    ) as up on uf.user_uuid = up.user_uuid
ORDER BY insert_ts DESC;



