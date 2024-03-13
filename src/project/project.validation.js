const Joi = require('joi');

exports.upsertProjectSchema = Joi.object({
  project_uuid: Joi.string().guid().allow('', null),
  project_name: Joi.string().required(),
  legal_entity: Joi.string().max(100).allow(null),
  project_manager_name: Joi.string().required(),
  project_manager_uuid: Joi.string().guid().required(),
  status: Joi.string().valid('ACTIVE', 'INACTIVE').default('ACTIVE').required(),
  created_by_uuid: Joi.string().guid().allow('', null),
  modified_by_uuid: Joi.string().guid().allow('', null),
});

exports.getProjectSchema = Joi.object({
  project_uuid: Joi.string().guid(),
  pageNo: Joi.number().integer().min(1),
  itemPerPage: Joi.number().integer().min(1),
  from_date: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  to_date: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  status: Joi.string(),
  columns: Joi.string(),
  value: Joi.string(),
});
