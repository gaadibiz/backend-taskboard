const Joi = require('joi');

exports.upsertCategorySchema = Joi.object({
  category_uuid: Joi.string().guid().max(100).allow(null),
  category_name: Joi.string().max(100),
  billing_company_uuid: Joi.string().guid().max(100).allow(null),
  description: Joi.string().max(250),
  status: Joi.string().valid('ACTIVE', 'INACTIVE'),
  created_by_uuid: Joi.string().guid().max(50).allow(null),
  modified_by_uuid: Joi.string().guid().allow('', null),
});

exports.getCategorySchema = Joi.object({
  category_id: Joi.number().integer(),
  category_uuid: Joi.string().guid(),
  billing_company_uuid: Joi.string().guid(),
  pageNo: Joi.number().integer().min(1),
  itemPerPage: Joi.number().integer().min(1),
  from_date: Joi.string().isoDate(),
  to_date: Joi.string().isoDate(),
  status: Joi.string(),
  columns: Joi.string(),
  value: Joi.string(),
});
