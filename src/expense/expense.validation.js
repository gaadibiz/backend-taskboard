const Joi = require('joi');

exports.upsertExpenseSchema = Joi.object({
  expense_uuid: Joi.string().guid().allow('', null),
  expense_type: Joi.string()
    .max(50)
    .valid('EXPENSE', 'JOB', 'ADVANCE')
    .allow('', null),
  job_order_no: Joi.string().max(100).allow('', null),
  job_uuid: Joi.string().guid().allow('', null),
  job_name: Joi.string().max(100).allow('', null),
  user_uuid: Joi.string().guid().allow('', null),
  user_name: Joi.string().max(100).allow('', null),
  billing_company_uuid: Joi.string().guid().max(100).allow('', null),
  billing_company_name: Joi.string().max(255).allow('', null),
  billing_company_branch_uuid: Joi.string().guid().max(100).allow('', null),
  billing_company_branch_name: Joi.string().max(255).allow('', null),
  project_name: Joi.string().max(100).allow('', null),
  project_uuid: Joi.string().guid().allow('', null),
  project_manager_uuid: Joi.string().guid().required(),
  project_manager_name: Joi.string().max(100).required(),
  finance_manager_uuid: Joi.string().guid().required(),
  finance_manager_name: Joi.string().max(100).required(),
  department_uuid: Joi.string().guid().allow('', null),
  department_name: Joi.string().max(100).allow('', null),
  expense_category_uuid: Joi.string().guid().max(500).allow('', null),
  expense_category_name: Joi.string().max(100).allow('', null),
  category_manager_name: Joi.string().max(100).required(),
  category_manager_uuid: Joi.string().guid().required(),
  receipt: Joi.array(),
  vendor_uuid: Joi.string().guid().max(500).allow('', null),
  merchant: Joi.string().max(100).allow('', null),
  expense_date: Joi.string().allow('', null),
  business_purpose: Joi.string().max(100).allow('', null),
  advance_amount: Joi.number().allow('', null),
  requested_advance_amount: Joi.number().allow('', null),
  reimbursed_amount: Joi.number().allow('', null),
  eligible_reimbursement_amount: Joi.number().allow('', null),
  is_deduct_from_advance: Joi.boolean().allow(0, 1, null),
  description: Joi.string().max(100).allow(null),
  status: Joi.string()
    .valid(
      'INACTIVE',
      'DRAFT',
      'EXPENSE_APPROVAL_REQUESTED',
      'FINANCE_APPROVAL_REQUESTED',
      'FINANCE',
    )
    .required(),
  special_approval_uuids: Joi.array().items(Joi.string().guid()),
  created_by_name: Joi.string().allow('', null),
  created_by_uuid: Joi.string().guid().allow('', null),
  modified_by_uuid: Joi.string().guid().allow('', null),
  modified_by_name: Joi.string().allow('', null),
});

exports.getExpenseSchema = Joi.object({
  expense_uuid: Joi.string().guid(),
  report_uuid: Joi.string().guid(),
  expense_category_uuid: Joi.string().guid(),
  project_uuid: Joi.string().guid(),
  billing_company_uuid: Joi.string().guid(),
  billing_company_branch_uuid: Joi.string().guid(),
  is_type_expense: Joi.boolean().allow(null),
  is_type_advance: Joi.boolean().allow(null),
  is_type_job: Joi.boolean(),
  pageNo: Joi.number().integer().min(1),
  itemPerPage: Joi.number().integer().min(1),
  from_date: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  to_date: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  status: Joi.string(),
  columns: Joi.string(),
  value: Joi.string(),
});

exports.upsertExpenseCategory = Joi.object({
  expense_category_uuid: Joi.string().guid().max(500).allow('', null),
  expense_category_name: Joi.string().max(100).required(),
  category_manager_name: Joi.string().max(100).required(),
  category_manager_uuid: Joi.string().guid().required(),
  billing_company_uuid: Joi.string().guid().max(100).allow('', null),
  billing_company_name: Joi.string().max(255).allow('', null),
  billing_company_branch_uuid: Joi.string().guid().max(100).allow('', null),
  billing_company_branch_name: Joi.string().max(255).allow('', null),
  expense_category_description: Joi.string().max(500).allow('', null),
  status: Joi.string().valid('ACTIVE', 'INACTIVE'),
  created_by_uuid: Joi.string().guid().max(50).allow(null),
  modified_by_uuid: Joi.string().guid().allow('', null),
});

exports.getExpenseCategory = Joi.object({
  expense_category_uuid: Joi.string().guid(),
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

exports.getAdvanceAmount = Joi.object({
  user_uuid: Joi.string().guid().required(),
});

exports.convertFinanceToCleared = Joi.object({
  expense_uuids: Joi.array(),
  created_by_uuid: Joi.string().guid().max(50).allow(null),
  modified_by_uuid: Joi.string().guid().allow('', null),
});
exports.exportFinanceExpense = Joi.object({
  expense_uuids: Joi.array().items(Joi.string().uuid()),
  billing_company_uuid: Joi.string().guid().max(50).required(),
  created_by_uuid: Joi.string().guid().max(50).allow(null),
  modified_by_uuid: Joi.string().guid().allow('', null),
});
