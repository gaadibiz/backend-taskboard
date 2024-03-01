const Joi = require('joi');

exports.upsertTaskSchema = Joi.object({
  task_uuid: Joi.string().guid().allow('', null),
  type: Joi.string().valid('Project').required(),
  type_name: Joi.string().max(255).required(),
  type_uuid: Joi.string().guid().required(),
  title: Joi.string().max(255).required(),
  description: Joi.string().allow(null),
  dueDate: Joi.date().iso().allow(null),
  uploadFile: Joi.object().allow(null),
  priority: Joi.string().max(50).valid('HIGH', 'MEDIUM', 'LOW').allow(null),
  assigned_to_name: Joi.string().max(100).required(),
  assigned_to_uuid: Joi.string().guid().required(),
  status: Joi.string()
    .valid('TODO', 'PROGRESS', 'HOLD', 'COMPLETED', 'ARCHIVE')
    .required(),
  created_by_uuid: Joi.string().guid().max(50),
});

exports.getTaskSchema = Joi.object({
  task_user_taskboard_id: Joi.number().integer(),
  task_uuid: Joi.string().guid(),
  pageNo: Joi.number().integer().min(1),
  itemPerPage: Joi.number().integer().min(1),
  from_date: Joi.string().isoDate(),
  to_date: Joi.string().isoDate(),
  status: Joi.string(),
  columns: Joi.string(),
  value: Joi.string(),
});

exports.getTaskListSchema = Joi.object({
  task_user_taskboard_id: Joi.number().integer(),
  task_uuid: Joi.string().guid(),
  pageNo: Joi.number().integer().min(1),
  itemPerPage: Joi.number().integer().min(1),
  from_date: Joi.string().isoDate(),
  to_date: Joi.string().isoDate(),
  status: Joi.string(),
  columns: Joi.string(),
  value: Joi.string(),
});

exports.upsertTaskDefinitionSchema = Joi.object({
  task_definition_uuid: Joi.string().guid().allow('', null),
  task_type: Joi.string()
    .required()
    .valid('date', 'weekly', 'monthly', 'yearly', 'daily', 'interval'),
  task_time: Joi.string().allow(null),
  task_date: Joi.date().iso().allow(null),
  task_day_of_week: Joi.number().allow(null),
  task_day_of_month: Joi.number().allow(null),
  task_month: Joi.number().allow(null),
  task_year: Joi.number().allow(null),
  task_interval: Joi.number().allow(null),
  type: Joi.string().valid('Project').required(),
  type_name: Joi.string().max(255).required(),
  type_uuid: Joi.string().guid().required(),
  title: Joi.string().max(255).required(),
  description: Joi.string().allow(null),
  dueDate: Joi.date().iso().allow(null),
  uploadFile: Joi.object().allow(null),
  priority: Joi.string().max(50).valid('HIGH', 'MEDIUM', 'LOW').allow(null),
  assigned_to_name: Joi.string().max(100).required(),
  assigned_to_uuid: Joi.string().guid().required(),
  status: Joi.string()
    .valid('TODO', 'PROGRESS', 'HOLD', 'COMPLETED', 'ARCHIVE')
    .required(),
  created_by_uuid: Joi.string().guid().max(50),
});

exports.getTaskSchema = Joi.object({
  task_definition_id: Joi.number().integer(),
  tastask_definition_uuid: Joi.string().guid(),
  pageNo: Joi.number().integer().min(1),
  itemPerPage: Joi.number().integer().min(1),
  from_date: Joi.string().isoDate(),
  to_date: Joi.string().isoDate(),
  status: Joi.string(),
  columns: Joi.string(),
  value: Joi.string(),
});
