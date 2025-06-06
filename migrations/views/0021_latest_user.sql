CREATE OR REPLACE VIEW latest_user AS
SELECT
    uf.user_fact_id,
    uf.user_uuid,
    uf.email,
    uf.status,
    uf.created_by_uuid,
    uf.insert_ts,
    lud.user_dim_id,
    lud.user_password,
    lr.role_value,
    lud.role_uuid,
    lr.role_name,
    lr.role_group,
    lud.affiliated_billing_company_uuids,
    lud.billing_company_branches,
    up.user_profile_id,
    up.first_name,
    up.last_name,
    up.middle_name,
    CONCAT (
        up.first_name,
        CASE
            WHEN up.middle_name IS NOT NULL THEN CONCAT (' ', up.middle_name)
            ELSE ''
        END,
        CASE
            WHEN up.last_name IS NOT NULL THEN CONCAT (' ', up.last_name)
            ELSE ''
        END
    ) AS full_name,
    up.personal_email,
    up.gender,
    up.legal_entity,
    up.sub_department,
    up.business_unit,
    up.secondary_job_title,
    up.reporting_manager_employee_no,
    up.skype_id,
    up.marriage_date,
    up.spouse_gender,
    up.is_physically_handicapped,
    up.blood_group,
    up.nationality,
    up.salary_payment_mode,
    up.bank_account_name,
    up.pf_establishment_id,
    up.pf_details_available,
    up.pf_number,
    up.pf_account_name,
    up.uan,
    up.esi_eligible,
    up.employee_esi_number,
    up.esi_details_available,
    up.esi_number,
    up.lwf_eligible,
    up.aadhaar_number,
    up.enrollment_number,
    up.dob_in_aadhaar_card,
    up.full_name_as_per_aadhaar_card,
    up.address_as_in_aadhaar_card,
    up.gender_as_in_aadhaar_card,
    up.pan_card_available,
    up.pan_number,
    up.full_name_as_per_pan_card,
    up.dob_in_pan_card,
    up.parents_name_as_per_pan_card,
    up.department_uuid,
    up.department_name,
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
    up.marital_status,
    up.attachment,
    up.bank_name,
    up.bank_account_number,
    up.bank_ifsc_code,
    up.bank_branch
FROM user_fact uf
JOIN (
    SELECT user_uuid, MAX(user_fact_id) AS max_user_fact_id
    FROM user_fact
    GROUP BY user_uuid
) AS latest_uf ON uf.user_uuid = latest_uf.user_uuid AND uf.user_fact_id = latest_uf.max_user_fact_id-- Latest user_fact per user_uuid
LEFT JOIN user_dim lud ON lud.user_dim_id = (
    SELECT MAX(user_dim_id)
    FROM user_dim
    WHERE user_uuid = uf.user_uuid
)-- Latest user_dim per user_uuid
LEFT JOIN user_profile up ON up.user_profile_id = (
    SELECT MAX(user_profile_id)
    FROM user_profile
    WHERE user_uuid = uf.user_uuid
)-- Latest user_profile per user_uuid
LEFT JOIN latest_roles lr ON lr.role_uuid = lud.role_uuid;-- Join roles