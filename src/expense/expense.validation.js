const Joi = require('joi');

exports.upsertExpenseSchema = Joi.object({
  expense_uuid: Joi.string().guid().allow('', null),
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
  category_manager_name: Joi.string().max(100).allow('', null),
  category_manager_uuid: Joi.string().guid().allow('', null),
  receipt: Joi.array(),
  merchant: Joi.string().max(100).allow('', null),
  expense_date: Joi.string().allow('', null),
  business_purpose: Joi.string().max(100).allow('', null),
  advanse_amount: Joi.number().allow('', null),
  reimbursed_amount: Joi.number().allow('', null),
  description: Joi.string().max(100).allow(null),
  status: Joi.string()
    .valid(
      'INACTIVE',
      'EXPENSE_REQUESTED',
      'EXPENSE_APPROVAL_REQUESTED',
      'FINANCE_APPROVAL_REQUESTED',
      'FINANCE',
    )
    .required(),
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
  unreported: Joi.string(),
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
  category_manager_name: Joi.string().max(100).allow('', null),
  category_manager_uuid: Joi.string().max(100).allow('', null),
  expense_category_description: Joi.string().max(500).allow('', null),
  status: Joi.string().valid('ACTIVE', 'INACTIVE'),
  created_by_uuid: Joi.string().guid().max(50).allow(null),
  modified_by_uuid: Joi.string().guid().allow('', null),
});

exports.getExpenseCategory = Joi.object({
  expense_category_uuid: Joi.string().guid(),
  pageNo: Joi.number().integer().min(1),
  itemPerPage: Joi.number().integer().min(1),
  from_date: Joi.string().isoDate(),
  to_date: Joi.string().isoDate(),
  status: Joi.string(),
  columns: Joi.string(),
  value: Joi.string(),
});
