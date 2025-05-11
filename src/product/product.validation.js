const Joi = require('joi');

exports.upsertProductSchema = Joi.object({
  product_uuid: Joi.string().guid().required().max(50).allow(null, ''),
  product_name: Joi.string().required().max(100),
  item_type: Joi.string().required().max(100).valid('PRODUCT', 'SERVICE'),
  hsn_code: Joi.string().max(100).allow(null, ''),
  unit: Joi.string().max(100).allow(null, ''),
  product_type: Joi.string().max(50).allow(null, ''),
  gst: Joi.string().max(50).allow(null, ''),
  cess: Joi.string().max(50).allow(null, ''),
  cess_amount: Joi.string().max(50).allow(null, ''),
  no_itc: Joi.string().max(50).valid('YES', 'NO').required(),
  category_uuid: Joi.string().guid().required(),
  category_name: Joi.string().max(100).required(),
  sell_price: Joi.string().max(100).allow(null, ''),
  sell_price_tax: Joi.string().max(100).allow(null, ''),
  purchase_price: Joi.string().max(100).allow(null, ''),
  purchase_price_tax: Joi.string().max(100).allow(null, ''),
  image: Joi.string().max(255).allow(null, ''),
  colour: Joi.string().max(50).allow(null, ''),
  description: Joi.string().allow(null).max(65535), // TEXT column can hold longer data
  status: Joi.string().valid('ACTIVE', 'INACIVE'),
  created_by_uuid: Joi.string().guid().required().max(50),
});

exports.getProductSchema = Joi.object({
  product_uuid: Joi.string().max(50),
  billing_company_uuid: Joi.string().max(50),
  pageNo: Joi.number().integer().min(1),
  itemPerPage: Joi.number().integer().min(1),
  from_date: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  to_date: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  status: Joi.string(),
  columns: Joi.string(),
  value: Joi.string(),
});

exports.getStockInfoSchema = Joi.object({
  product_uuid: Joi.string().guid(),
  product_name: Joi.string(),
  billing_company_uuid: Joi.string().guid(),
});
