const Joi = require('joi');

exports.upsertUserSchema = Joi.object({
  user_uuid: Joi.string().guid().allow(null),
  last_name: Joi.string().max(50).allow(null),
  email: Joi.string().email().max(500).required(),
  first_name: Joi.alternatives().conditional('user_uuid', {
    is: Joi.string().required(),
    then: Joi.optional(),
    otherwise: Joi.string().min(1).max(50).required(),
  }),
  user_password: Joi.when('user_uuid', {
    is: Joi.string().required(),
    then: Joi.optional(),
    otherwise: Joi.string().min(8).max(500).required(),
  }),
  branch_name: Joi.when('user_uuid', {
    is: Joi.string().required(),
    then: Joi.optional(),
    otherwise: Joi.string().min(2).max(50).required(),
  }),
  branch_uuid: Joi.when('user_uuid', {
    is: Joi.string().required(),
    then: Joi.optional(),
    otherwise: Joi.string().guid().max(50).required(),
  }),
  role_uuid: Joi.string().guid().max(50).required(),
  status: Joi.string().valid('ACTIVE', 'INACTIVE').default('ACTIVE').required(),
  created_by_uuid: Joi.string().guid().max(50).allow(null),
});

exports.upsertUserProfileSchema = Joi.object({
  user_uuid: Joi.string().guid().max(50).required(),
  first_name: Joi.string().max(50).required(),
  last_name: Joi.string().max(50).allow(null),
  personal_email: Joi.string().email().max(500).required(),
  job_title: Joi.string().max(50).allow(null),
  manager_uuid: Joi.string().guid().max(50).allow('', null),
  hierarchy_uuids: Joi.array().items(Joi.string().guid()).allow(null),
  user_type: Joi.string().max(50).allow(null),
  assigned_phone_number: Joi.string().allow(null),
  shared_email: Joi.string().max(500).allow('', null),
  mobile: Joi.string().max(50).required().allow(null),
  home_phone: Joi.string().max(50).allow(null),
  linkedin_profile: Joi.string().max(50).allow(null),
  hire_date: Joi.string().max(50).allow(null),
  last_day_at_work: Joi.string().max(50).allow(null),
  department: Joi.string().max(50).allow(null),
  fax: Joi.string().max(50).allow(null),
  date_of_birth: Joi.string().max(50).allow(null),
  mother_maiden_name: Joi.string().max(50).allow(null),
  photo: Joi.string().max(50).allow(null),
  signature: Joi.string().max(50).allow(null),
  street_address: Joi.string().max(50).allow(null),
  unit_or_suite: Joi.string().max(100).allow(null),
  city: Joi.string().max(50).allow(null),
  province_or_state: Joi.string().max(50).allow(null),
  postal_code: Joi.string().max(50).allow(null),
  country: Joi.string().max(100).allow(null),
  languages_known: Joi.string().max(50).allow(null),
  documents: Joi.string().max(50).allow(null),
  branch_name: Joi.string().max(50).required(),
  branch_uuid: Joi.string().guid().max(50).required(),
  status: Joi.string().valid('ACTIVE', 'INACTIVE').default('ACTIVE').required(),
  created_by_uuid: Joi.string().guid().max(50).allow('', null),
  modified_by_uuid: Joi.string().guid().allow('', null),
});

exports.getUserSchema = Joi.object({
  user_profile_id: Joi.number().integer(),
  user_uuid: Joi.string().guid().max(50),
  role_uuid: Joi.string().guid(),
  role_group: Joi.string().allow(null),
  pageNo: Joi.number().integer().min(1),
  itemPerPage: Joi.number().integer().min(1),
  from_date: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  to_date: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  status: Joi.string(),
  columns: Joi.string(),
  value: Joi.string(),
});

exports.upsertManageSiteSchema = Joi.object({
  manage_site_uuid: Joi.string().guid().max(100).allow(null),
  logo: Joi.string().max(255).allow(null),
  site_name: Joi.string().max(250).allow(null),
  login_title: Joi.string().max(250).allow(null),
  status: Joi.string().valid('ACTIVE', 'INACTIVE'),
  created_by_uuid: Joi.string().guid().max(50).allow(null),
  modified_by_uuid: Joi.string().guid().allow('', null),
});

exports.getManageSiteSchema = Joi.object({
  comment_t_id: Joi.number().integer(),
  manage_site_uuid: Joi.string().guid(),
  pageNo: Joi.number().integer().min(1),
  itemPerPage: Joi.number().integer().min(1),
  from_date: Joi.string().isoDate(),
  to_date: Joi.string().isoDate(),
  status: Joi.string(),
  columns: Joi.string(),
  value: Joi.string(),
});
