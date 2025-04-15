const Joi = require('joi');

exports.getDraftSchema = Joi.object({
  draft_code: Joi.string().guid().allow(null),
  reference_data_uuid: Joi.string().guid(),
  created_by_uuid: Joi.string().required(),
  pageNo: Joi.number().integer().min(1),
  itemPerPage: Joi.number().integer().min(1),
  pageLimit: Joi.number().integer(),
  from_date: Joi.string().isoDate().allow(null),
  to_date: Joi.string().isoDate().allow(null),
  status: Joi.string().allow(null),
  columns: Joi.string().allow(null),
  value: Joi.string().allow(null),
  advanceFilter: Joi.alternatives().try(
    Joi.array().items(
      Joi.object({
        column: Joi.array().items(Joi.string()).default(['']),
        operator: Joi.string()
          .valid(
            'EQUAL',
            'NOT_EQUAL',
            'GREATER',
            'LESSER',
            'GREATER_THAN_EQUAL',
            'LESSER_THAN_EQUAL',
            'CONTAINS',
            'STARTS_WITH',
            'ENDS_WITH',
            'DATE_RANGE',
          )
          .default('EQUAL'),
        value: Joi.string().default(''),
        logicalOperator: Joi.string().valid('AND', 'OR').default('AND'),
      }),
    ),
    Joi.string(), // Allow string format (if not properly parsed as an array)
  ),
});

exports.upsertDraftSchems = Joi.object({
  draft_code: Joi.string().allow(null, ''),
  form_url: Joi.string().required(),
  reference_data_uuid: Joi.string().guid().allow(null, ''),
  reference_data: Joi.object().allow(null),
  status: Joi.string().valid('ACTIVE', 'INACTIVE'),
  created_by_uuid: Joi.string().guid().allow(null),
  created_by_name: Joi.string().allow(null),
  modified_by_uuid: Joi.string().guid().allow(null),
  modified_by_name: Joi.string().allow(null),
});

exports.deleteDraftSchema = Joi.object({
  form_url: Joi.string().required(),
});
