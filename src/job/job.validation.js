const Joi = require('joi');

exports.upsertJobSchema = Joi.object({
  job_uuid: Joi.string().guid().max(50).allow('', null),
  job_order_no: Joi.string().max(100).required().allow('', null),
  job_order_date: Joi.string().required(),
  project_uuid: Joi.string().guid().max(50).required(),
  project_name: Joi.string().max(100).required(),
  project_manager_uuid: Joi.string().guid().max(50).required(),
  project_manager_name: Joi.string().max(100).required().required(),
  finance_manager_uuid: Joi.string().guid().max(50).required(),
  finance_manager_name: Joi.string().max(100).required(),
  vendor_uuid: Joi.string().guid().max(50).allow('', null),
  vendor_name: Joi.string().max(100).required().allow('', null),
  purchase_order_uuid: Joi.string().guid().max(50).allow('', null),
  purchase_order_no: Joi.string().max(100).required().allow('', null),
  status: Joi.string().max(255).required().default('ACTIVE'),
  created_by_uuid: Joi.string().guid().max(50).allow('', null),
  modified_by_uuid: Joi.string().guid().max(50).allow('', null),
});

exports.getQuotationSchema = Joi.object({
  job_order_no: Joi.string(),
  job_uuid: Joi.string(),
  project_uuid: Joi.string().guid(),
  pageNo: Joi.number().integer().min(1),
  itemPerPage: Joi.number().integer().min(1),
  from_date: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  to_date: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  status: Joi.string(),
  columns: Joi.string(),
  value: Joi.string(),
});
