const Joi = require('joi');

exports.upsertTaskSchema = Joi.object({
  task_uuid: Joi.string().guid().allow('', null),
  type: Joi.string().valid('project').required(),
  type_name: Joi.string().max(255).required(),
  type_uuid: Joi.string().guid().required(),
  billing_company_uuid: Joi.string().guid().max(100).allow('', null),
  billing_company_name: Joi.string().max(255).allow('', null),
  billing_company_branch_uuid: Joi.string().guid().max(100).allow('', null),
  billing_company_branch_name: Joi.string().max(255).allow('', null),
  title: Joi.string().max(255).required(),
  description: Joi.string().allow(null),
  due_date: Joi.date().iso().allow(null),
  dueDate: Joi.string().allow(null, ''),
  upload_file: Joi.string().allow(null),
  priority: Joi.string().max(50).valid('HIGH', 'MEDIUM', 'LOW').allow(null),
  time_taken: Joi.string().allow(null),
  category_name: Joi.string().allow(null),
  category_uuid: Joi.string().guid().allow(null),
  project_manager: Joi.string().allow(null),
  project_manager_uuid: Joi.string().guid().allow(null),
  assigned_to_name: Joi.string().max(100).required(),
  assigned_to_uuid: Joi.string().guid().required(),
  status: Joi.string()
    .valid('TODO', 'PROGRESS', 'HOLD', 'COMPLETED', 'ARCHIVE')
    .required(),
  created_by_uuid: Joi.string().guid().max(50),
  created_by_name: Joi.string().max(100),
  modified_by_uuid: Joi.string().guid().allow('', null),
  modified_by_name: Joi.string().max(100).allow('', null),
});

exports.getTaskSchema = Joi.object({
  task_user_taskboard_id: Joi.number().integer(),
  task_uuid: Joi.string().guid(),
  billing_company_uuid: Joi.string().guid().allow('', null),
  billing_company_branch_uuid: Joi.string().guid().allow('', null),
  pageNo: Joi.number().integer().min(1),
  itemPerPage: Joi.number().integer().min(1),
  from_date: Joi.string().isoDate(),
  to_date: Joi.string().isoDate(),
  status: Joi.string(),
  columns: Joi.string(),
  value: Joi.string(),
});

exports.getTaskCountSchema = Joi.object({
  billing_company_uuid: Joi.string().guid(),
  billing_company_branch_uuid: Joi.string().guid(),
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
  billing_company_uuid: Joi.string().guid(),
  billing_company_branch_uuid: Joi.string().guid(),
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
    .valid(
      'date',
      'weekly',
      'weekdays',
      'monthly',
      'yearly',
      'daily',
      'interval',
    ),
  task_time: Joi.string().allow(null),
  task_date: Joi.date().iso().allow(null),
  task_day_of_week: Joi.number().allow(null),
  task_weekdays: Joi.array().allow(null),
  task_day_of_month: Joi.number().allow(null),
  task_month: Joi.number().allow(null),
  task_year: Joi.number().allow(null),
  task_interval: Joi.number().allow(null),
  type: Joi.string().valid('Project').required(),
  type_name: Joi.string().max(255).required(),
  type_uuid: Joi.string().guid().required(),
  title: Joi.string().max(255).required(),
  description: Joi.string().allow(null),
  due_date: Joi.date().iso().allow(null),
  upload_file: Joi.object().allow(null),
  priority: Joi.string().max(50).valid('HIGH', 'MEDIUM', 'LOW').allow(null),
  category_name: Joi.string().allow(null),
  category_uuid: Joi.string().guid().allow(null),
  project_manager: Joi.string().allow(null),
  project_manager_uuid: Joi.string().guid().allow(null),
  task_details: Joi.string().allow(null),
  assigned_to_name: Joi.string().max(100).required(),
  assigned_to_uuid: Joi.string().guid().required(),
  status: Joi.string()
    .valid('TODO', 'PROGRESS', 'HOLD', 'COMPLETED', 'ARCHIVE')
    .required(),
  created_by_uuid: Joi.string().guid().max(50),
  created_by_name: Joi.string().max(100),
  modified_by_uuid: Joi.string().guid().allow('', null),
  modified_by_name: Joi.string().max(100).allow('', null),
});

exports.getTaskDefinitionSchema = Joi.object({
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
exports.assignTaskWithAISchema = Joi.object({
  prompt: Joi.string().required(),
  project_uuid: Joi.string().required(),
});
