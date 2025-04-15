CREATE OR REPLACE VIEW latest_dynamic_approval_history AS
SELECT 
    da.*, 
    le.expense_uuid, 
    le.expense_type, 
    le.user_uuid, 
    le.user_name,
    le.job_uuid,
    le.job_name,
    le.job_order_no,
    le.project_uuid,
    le.project_name,
    le.project_manager_name,
    le.project_manager_uuid,
    le.finance_manager_name,
    le.finance_manager_uuid,
    le.department_name,
    le.department_uuid,
    le.expense_category_uuid,
    le.expense_category_name,
    le.category_manager_name,
    le.category_manager_uuid,
    le.vendor_uuid,
    le.merchant,
    le.business_purpose,
    le.expense_date
FROM 
    dynamic_approval da
LEFT JOIN 
    latest_expense le 
ON 
    da.record_uuid = le.expense_uuid;
