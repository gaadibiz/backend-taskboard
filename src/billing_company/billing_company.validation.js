const Joi = require('joi');

exports.upsertBillingCompanySchema = Joi.object({
  billing_company_uuid: Joi.string().guid().required().max(50).allow(null, ''),
  billing_company_name: Joi.string().required().max(100),
  billing_company_line1: Joi.string().max(500).allow('', null),
  billing_company_line2: Joi.string().max(500).allow('', null),
  billing_company_city: Joi.string().max(100).allow('', null),
  billing_company_state: Joi.string().max(255).allow('', null),
  billing_company_pincode: Joi.string().max(255).allow('', null),
  billing_company_country: Joi.string().max(255).allow('', null),
  mobile: Joi.string().max(255).allow('', null),
  phone_number: Joi.string().max(255).allow('', null),
  website: Joi.string().max(255).allow('', null),
  gst_in: Joi.string().max(255).allow('', null),
  mail_id: Joi.string().max(255).allow('', null),
  bank_name: Joi.string().max(255).allow('', null),
  branch: Joi.string().max(255).allow('', null),
  account_no: Joi.string().max(500).allow('', null),
  swift_code: Joi.string().max(500).allow('', null),
  ifsc_code: Joi.string().max(100).allow('', null),
  created_by_uuid: Joi.string().guid().max(50).allow('', null),
  created_by_name: Joi.string().max(50).allow('', null),
  modified_by_uuid: Joi.string().guid().allow('', null),
  modified_by_name: Joi.string().max(50).allow('', null),
});

exports.getBillingCompanySchema = Joi.object({
  billing_company_id: Joi.number().integer(),
  billing_company_uuid: Joi.string().guid(),
  pageNo: Joi.number().integer().min(1),
  itemPerPage: Joi.number().integer().min(1),
  from_date: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  to_date: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  status: Joi.string(),
  columns: Joi.string(),
  value: Joi.string(),
});
