const Joi = require('joi');

exports.upsertJobSchema = Joi.object({
  job_uuid: Joi.string().guid().max(50).allow('', null),
  job_order_no: Joi.string().max(100).required().allow('', null),
  job_order_date: Joi.string().required(),
  job_name: Joi.string().max(100).required(),
  billing_company_uuid: Joi.string().guid().max(100).allow('', null),
  billing_company_name: Joi.string().max(255).allow('', null),
  billing_company_branch_uuid: Joi.string().guid().max(100).allow('', null),
  billing_company_branch_name: Joi.string().max(255).allow('', null),
  project_uuid: Joi.string().guid().max(50).required(),
  project_name: Joi.string().max(100).required(),
  project_manager_uuid: Joi.string().guid().max(50).required(),
  project_manager_name: Joi.string().max(100).required().required(),
  finance_manager_uuid: Joi.string().guid().max(50).required(),
  finance_manager_name: Joi.string().max(100).required(),
  vendor_uuid: Joi.string().guid().max(50).allow('', null),
  vendor_name: Joi.string().max(100).required().allow('', null),
  priority: Joi.string().max(100).allow('', null),
  additional_fields: Joi.array().allow('', null),
  expected_delivery_date: Joi.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .allow('', null),
  due_date: Joi.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .allow('', null),

  attachment: Joi.array(),
  status: Joi.string()
    .max(255)
    .valid('INACTIVE', 'DRAFT', 'JOB_APPROVAL_REQUESTED')
    .required()
    .default('DRAFT'),
  created_by_uuid: Joi.string().guid().max(50).allow('', null),
  modified_by_uuid: Joi.string().guid().max(50).allow('', null),
});

exports.getJobSchema = Joi.object({
  job_order_no: Joi.string(),
  job_uuid: Joi.string(),
  billing_company_uuid: Joi.string().guid(),
  billing_company_branch_uuid: Joi.string().guid(),
  project_uuid: Joi.string().guid(),
  pageNo: Joi.number().integer().min(1),
  itemPerPage: Joi.number().integer().min(1),
  from_date: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  to_date: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  status: Joi.string(),
  columns: Joi.string(),
  value: Joi.string(),
});
