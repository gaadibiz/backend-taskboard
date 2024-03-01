const Joi = require('joi');

exports.upsertCategorySchema = Joi.object({
  category_uuid: Joi.string().guid().max(100).allow(null),
  category_name: Joi.string().max(100),
  description: Joi.string().max(250),
  status: Joi.string().valid('ACTIVE', 'INACTIVE'),
  created_by_uuid: Joi.string().guid().max(50).allow(null),
});

exports.getCategorySchema = Joi.object({
  comment_t_id: Joi.number().integer(),
  comment_t_uuid: Joi.string().guid(),
  parent_module_no: Joi.string(),
  module_uuid: Joi.string().guid().max(50),
  pageNo: Joi.number().integer().min(1),
  itemPerPage: Joi.number().integer().min(1),
  from_date: Joi.string().isoDate(),
  to_date: Joi.string().isoDate(),
  status: Joi.string(),
  columns: Joi.string(),
  value: Joi.string(),
});
