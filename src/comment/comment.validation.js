const Joi = require('joi');

exports.upsertCommentSchema = Joi.object({
  comment_t_uuid: Joi.string().guid().max(100).allow('', null),
  record_uuid: Joi.string().allow(null, ''),
  table_name: Joi.string().allow(null, ''),
  attachment: Joi.array().allow(null, ''),
  comment_remark: Joi.string(),
  status: Joi.string().valid('ACTIVE', 'INACTIVE'),
  created_by_name: Joi.string().allow(null, ''),
  created_by_uuid: Joi.string().guid().max(50).allow('', null),
  modified_by_uuid: Joi.string().guid().allow('', null),
  modified_by_name: Joi.string().allow(null, ''),
});

exports.getCommentSchema = Joi.object({
  comment_t_id: Joi.number().integer(),
  comment_t_uuid: Joi.string().guid(),
  record_uuid: Joi.string().guid().max(50),
  pageNo: Joi.number().integer().min(1),
  itemPerPage: Joi.number().integer().min(1),
  from_date: Joi.string().isoDate(),
  to_date: Joi.string().isoDate(),
  status: Joi.string(),
  columns: Joi.string(),
  value: Joi.string(),
});
