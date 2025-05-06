const Joi = require('joi');

exports.upsertVendorSchema = Joi.object({
  vendor_uuid: Joi.string().guid().required().max(50).allow(null, ''),
  vendor_name: Joi.string().required().max(100),
  billing_company_uuid: Joi.string().guid().allow(null, ''),
  billing_company_name: Joi.string().allow(null, ''),
  billing_company_branch_uuid: Joi.string().guid().max(100).allow('', null),
  billing_company_branch_name: Joi.string().max(255).allow('', null),
  registration_type: Joi.string().required().max(100),
  vendor_address_line1: Joi.string().max(500).allow(null),
  vendor_address_line2: Joi.string().max(500).allow(null),
  vendor_address_city: Joi.string().max(100).allow(null),
  vendor_address_state: Joi.string().max(255).allow(null),
  vendor_address_pincode: Joi.string().max(255).allow(null),
  vendor_address_country: Joi.string().max(255).allow(null),
  additional_fields: Joi.array().allow('', null),
  contact_name: Joi.string().allow(null),
  mobile: Joi.string().max(255).allow(null),
  phone_number: Joi.string().max(255).allow(null),
  website: Joi.string().max(255).allow(null),
  gst_in: Joi.string().max(255).allow(null),
  mail_id: Joi.string().max(255).allow(null),
  bank_name: Joi.string().allow(null),
  bank_account_no: Joi.string().allow(null),
  bank_ifsc_code: Joi.string().allow(null),
  bank_branch_name: Joi.string().allow(null),
  note: Joi.string().allow(null),
  pan_no: Joi.string().allow(null),
  status: Joi.string().max(255).allow(null, ''),
  modified_by_uuid: Joi.string().guid().max(50).allow(null),
  created_by_uuid: Joi.string().guid().max(50).allow(null),
});

exports.getVendorSchema = Joi.object({
  vendor_id: Joi.number().integer(),
  vendor_uuid: Joi.string().guid(),
  billing_company_uuid: Joi.string().guid().allow('', null),
  billing_company_branch_uuid: Joi.string().guid().allow('', null),
  pageNo: Joi.number().integer().min(1),
  itemPerPage: Joi.number().integer().min(1),
  from_date: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  to_date: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  status: Joi.string(),
  columns: Joi.string(),
  value: Joi.string(),
});

exports.upsertVendorExpenseSchema = Joi.object({
  vendor_expense_uuid: Joi.string().guid().allow('', null),
  expense_type: Joi.string()
    .max(50)
    .valid('EXPENSE', 'JOB', 'ADVANCE')
    .allow('', null),
  job_order_no: Joi.string().max(100).allow('', null),
  job_uuid: Joi.string().guid().allow('', null),
  job_name: Joi.string().max(100).allow('', null),
  billing_company_uuid: Joi.string().guid().max(100).allow('', null),
  billing_company_name: Joi.string().max(255).allow('', null),
  billing_company_branch_uuid: Joi.string().max(100).allow('', null),
  billing_company_branch_name: Joi.string().max(255).allow('', null),
  project_name: Joi.string().max(100).allow('', null),
  project_uuid: Joi.string().guid().allow('', null),
  project_manager_uuid: Joi.string().guid().required(),
  project_manager_name: Joi.string().max(100).required(),
  finance_manager_uuid: Joi.string().guid().required(),
  finance_manager_name: Joi.string().max(100).required(),
  department_uuid: Joi.string().guid().allow('', null),
  department_name: Joi.string().max(100).allow('', null),
  vendor_expense_category_uuid: Joi.string().guid().max(500).allow('', null),
  vendor_expense_category_name: Joi.string().max(100).allow('', null),
  category_manager_name: Joi.string().max(100).required(),
  category_manager_uuid: Joi.string().guid().required(),
  receipt: Joi.array(),
  vendor_uuid: Joi.string().guid().max(500).allow('', null),
  vendor_name: Joi.string().max(100).allow('', null),
  merchant: Joi.string().max(100).allow('', null),
  expense_date: Joi.string().allow('', null),
  business_purpose: Joi.string().max(100).allow('', null),
  advance_amount: Joi.number().allow('', null),
  actual_advance_amount: Joi.number().allow('', null),
  requested_advance_amount: Joi.number().allow('', null),
  actual_reimbursed_amount: Joi.number().allow('', null),
  actual_requested_advance_amount: Joi.number().allow('', null),
  reimbursed_amount: Joi.number().allow('', null),
  eligible_reimbursement_amount: Joi.number().allow('', null),
  is_deduct_from_advance: Joi.boolean().allow(0, 1, null),
  description: Joi.string().min(30).max(10000).allow(null),
  additional_fields: Joi.array().allow('', null),
  status: Joi.string()
    .valid(
      'INACTIVE',
      'DRAFT',
      'EXPENSE_APPROVAL_REQUESTED',
      'FINANCE_APPROVAL_REQUESTED',
      'EXPENSE_REQUESTED',
      'FINANCE_APPROVED',
    )
    .required(),
  special_approval_uuids: Joi.array()
    .items(Joi.string().guid())
    .allow('', null),
  created_by_name: Joi.string().allow('', null),
  created_by_uuid: Joi.string().guid().allow('', null),
  modified_by_uuid: Joi.string().guid().allow('', null),
  modified_by_name: Joi.string().allow('', null),
});

exports.getvendorExpenseSchema = Joi.object({
  vendor_expense_uuid: Joi.string().guid(),
  billing_company_uuid: Joi.string().guid(),
  pageNo: Joi.number().integer().min(1),
  itemPerPage: Joi.number().integer().min(1),
  pageLimit: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .description('The maximum number of pages allowed.'),
  from_date: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  to_date: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  status: Joi.string(),
  columns: Joi.string(),
  value: Joi.string(),
  advanceFilter: Joi.alternatives()
    .try(
      Joi.string(),
      Joi.array().items(
        Joi.object({
          column: Joi.array().items(Joi.string()).required(),
          operator: Joi.string()
            .valid(
              'EQUAL',
              'NOT_EQUAL',
              'GREATER',
              'LESSER',
              'GREATER_THAN_EQUAL',
              'LESSER_THAN_EQUAL',
              'CONTAINS',
              'STARTS_WITH',
              'ENDS_WITH',
              'DATE_RANGE',
            )
            .required(),
          value: Joi.string().allow(null),
          logicalOperator: Joi.string().valid('AND', 'OR').required(),
        }),
      ),
    )
    .allow(null),
});

exports.upsertVendorExpenseCategorySchema = Joi.object({
  vendor_expense_category_uuid: Joi.string().guid().max(500).allow('', null),
  vendor_expense_category_name: Joi.string().max(100).required(),
  category_manager_name: Joi.string().max(100).required(),
  category_manager_uuid: Joi.string().guid().required(),
  billing_company_uuid: Joi.string().guid().max(100).allow('', null),
  billing_company_name: Joi.string().max(255).allow('', null),
  billing_company_branch_uuid: Joi.string().guid().max(100).allow('', null),
  billing_company_branch_name: Joi.string().max(255).allow('', null),
  vendor_expense_category_description: Joi.string().max(500).allow('', null),
  status: Joi.string().valid('ACTIVE', 'INACTIVE'),
  created_by_uuid: Joi.string().guid().max(50).allow(null),
  modified_by_uuid: Joi.string().guid().allow('', null),
});

exports.getVendorExpenseCategorySchema = Joi.object({
  vendor_expense_category_uuid: Joi.string().guid(),
  billing_company_uuid: Joi.string().guid().max(100),
  billing_company_branch_uuid: Joi.string().guid().max(100).allow('', null),
  pageNo: Joi.number().integer().min(1),
  itemPerPage: Joi.number().integer().min(1),
  from_date: Joi.string().isoDate(),
  to_date: Joi.string().isoDate(),
  status: Joi.string(),
  columns: Joi.string(),
  value: Joi.string(),
});
