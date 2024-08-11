const Joi = require('joi');

exports.upsertProjectSchema = Joi.object({
  project_uuid: Joi.string().guid().allow('', null),
  project_name: Joi.string().required(),
  legal_entity: Joi.string().max(100).allow(null),
  remarks: Joi.string().max(100).allow(null),
  start_date: Joi.string().max(100).allow(null),
  end_date: Joi.string().max(100).allow(null),
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

exports.upsertProjectTeamSchema = Joi.object({
  project_team_uuid: Joi.string().guid().allow('', null),
  project_uuid: Joi.string().guid().allow('', null),
  project_name: Joi.string().required(),
  user_uuid: Joi.string().guid().allow('', null),
  user_name: Joi.string().allow('', null),
  status: Joi.string().valid('ACTIVE', 'INACTIVE').default('ACTIVE').required(),
  created_by_uuid: Joi.string().guid().allow('', null),
  modified_by_uuid: Joi.string().guid().allow('', null),
});

exports.getProjectTeamSchema = Joi.object({
  project_uuid: Joi.string().guid(),
  pageNo: Joi.number().integer().min(1),
  itemPerPage: Joi.number().integer().min(1),
  from_date: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  to_date: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  status: Joi.string(),
  columns: Joi.string(),
  value: Joi.string(),
});
