const Joi = require('joi');

exports.upsertExpenseSchema = Joi.object({
  expense_uuid: Joi.string().guid().allow('', null),
  report_uuid: Joi.string().guid().allow('', null),
  project_uuid: Joi.string().guid().allow('', null),
  receipt: Joi.string(),
  merchant: Joi.string().max(100).allow(null),
  category: Joi.string().max(100).allow(null),
  amount: Joi.number().allow('', null),
  description: Joi.string().max(100).allow(null),
  status: Joi.string().valid('ACTIVE', 'INACTIVE').default('ACTIVE').required(),
  created_by_uuid: Joi.string().guid().allow('', null),
  modified_by_uuid: Joi.string().guid().allow('', null),
});

exports.getExpenseSchema = Joi.object({
  expense_uuid: Joi.string().guid(),
  report_uuid: Joi.string().guid(),
  project_uuid: Joi.string().guid(),
  pageNo: Joi.number().integer().min(1),
  itemPerPage: Joi.number().integer().min(1),
  from_date: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  to_date: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  status: Joi.string(),
  columns: Joi.string(),
  value: Joi.string(),
});

exports.upsertReportSchema = Joi.object({
  report_uuid: Joi.string().guid().allow('', null),
  project_uuid: Joi.string().guid().allow('', null),
  project_manager_name: Joi.string().required(),
  project_manager_uuid: Joi.string().guid().allow('', null),
  department_uuid: Joi.string().guid().allow('', null),
  department_name: Joi.string().allow('', null),
  report_name: Joi.string().allow('', null),
  business_purpose: Joi.string().allow('', null),
  category: Joi.string().allow('', null),
  advance_amount: Joi.number().allow('', null),
  reimbursed_amount: Joi.number().allow('', null),
  description: Joi.string().allow('', null),
  status: Joi.string()
    .valid(
      'REPORT_REQUESTED',
      'REPORT_APPROVAL_REQUESTED',
      'FINANCE_APPROVAL_REQUESTED',
    )
    .default('REPORT_APPROVAL_REQUESTED')
    .required(),
  created_by_uuid: Joi.string().guid().allow('', null),
  modified_by_uuid: Joi.string().guid().allow('', null),
});

exports.getReportSchema = Joi.object({
  report_uuid: Joi.string().guid(),
  project_uuid: Joi.string().guid(),
  project_manager_uuid: Joi.string().guid(),
  department_uuid: Joi.string().guid(),
  pageNo: Joi.number().integer().min(1),
  itemPerPage: Joi.number().integer().min(1),
  from_date: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  to_date: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  status: Joi.string(),
  columns: Joi.string(),
  value: Joi.string(),
});
