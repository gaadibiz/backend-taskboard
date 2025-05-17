const Joi = require('joi');

exports.upsertLedgerSchema = Joi.object({
  ledger_uuid: Joi.string().guid().required().max(50).allow(null, ''),
  selling_name: Joi.string().max(100),
  quantity: Joi.number().integer(),
  invoice_no: Joi.string().max(50),
  billing_company_uuid: Joi.string().guid().max(100).allow('', null),
  billing_company_name: Joi.string().max(255).allow('', null),
  balance: Joi.number(),
  customer_name: Joi.string().max(100),
  type: Joi.string().max(100).required(),
  status: Joi.string().valid('ACTIVE', 'INACIVE'),
  created_by_uuid: Joi.string().guid().max(50).allow('', null),
  created_by_name: Joi.string().max(50).allow('', null),
  modified_by_uuid: Joi.string().guid().allow('', null),
  modified_by_name: Joi.string().max(50).allow('', null),
});

exports.getLedgerSchema = Joi.object({
  ledger_uuid: Joi.string().max(50).guid().allow('', null),
  product_uuid: Joi.string().max(50).guid().allow('', null),
  pageNo: Joi.number().integer().min(1),
  itemPerPage: Joi.number().integer().min(1),
  from_date: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  to_date: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  status: Joi.string(),
  columns: Joi.string(),
  value: Joi.string(),
});
