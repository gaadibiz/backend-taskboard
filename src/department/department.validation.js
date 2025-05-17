const Joi = require('joi');

exports.upsertDepartmentSchema = Joi.object({
  department_uuid: Joi.string().guid().allow('', null),
  department_head_uuid: Joi.string().guid().required(),
  department_head_name: Joi.string().required(),
  department_name: Joi.string().max(100).allow(null),
  billing_company_uuid: Joi.string().guid().allow('', null),
  billing_company_name: Joi.string().max(255).allow('', null),
  billing_company_branch_uuid: Joi.string().guid().allow('', null),
  billing_company_branch_name: Joi.string().max(255).allow('', null),
  department_details: Joi.string().max(500).allow('', null),
  category: Joi.string().max(500).allow(null),
  status: Joi.string().valid('ACTIVE', 'INACTIVE').default('ACTIVE').required(),
  created_by_uuid: Joi.string().guid().max(50).allow('', null),
  created_by_name: Joi.string().max(50).allow('', null),
  modified_by_uuid: Joi.string().guid().allow('', null),
  modified_by_name: Joi.string().max(50).allow('', null),
});

exports.getDepartmentSchema = Joi.object({
  department_uuid: Joi.string().guid(),
  billing_company_uuid: Joi.string().guid(),
  billing_company_branch_uuid: Joi.string().guid(),
  pageNo: Joi.number().integer().min(1),
  itemPerPage: Joi.number().integer().min(1),
  from_date: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  to_date: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  status: Joi.string(),
  columns: Joi.string(),
  value: Joi.string(),
});
