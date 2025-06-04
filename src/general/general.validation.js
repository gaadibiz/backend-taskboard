const Joi = require('joi');

exports.sendGridEmailBodySchema = Joi.object({
  module_name: Joi.string(),
  module_uuid: Joi.string().max(50),
  comment: Joi.string().allow('', null),
  emails: Joi.array().required(),
  subject: Joi.string().required(),
  body: Joi.string().required(),
  templateName: Joi.string().allow('', null),
  objectVariables: Joi.object(),
  cc: Joi.array(),
  bcc: Joi.array(),
  reply_to: Joi.object({
    email: Joi.string().email().allow('', null),
    name: Joi.string().allow('', null),
  }).allow(null),

  attachments: Joi.array(),
  created_by_uuid: Joi.string().guid().max(50).allow('', null),
  created_by_name: Joi.string().max(50).allow('', null),
  modified_by_uuid: Joi.string().guid().allow('', null),
  modified_by_name: Joi.string().max(50).allow('', null),
});

exports.getSignedUrlschema = Joi.object({ key: Joi.string().required() });

exports.uploadFiles = Joi.object({
  files: Joi.array(),
  module_name: Joi.string(),
  as_payload: Joi.string().allow('', null),
  created_by_uuid: Joi.string().guid().max(50).allow('', null),
  created_by_name: Joi.string().max(50).allow('', null),
  modified_by_uuid: Joi.string().guid().allow('', null),
  modified_by_name: Joi.string().max(50).allow('', null),
});

exports.downloadFiles = Joi.object({
  type: Joi.string().valid('json', '').allow('', null),
  keys: Joi.array(),
  created_by_uuid: Joi.string().guid().max(50).allow('', null),
  created_by_name: Joi.string().max(50).allow('', null),
  modified_by_uuid: Joi.string().guid().allow('', null),
  modified_by_name: Joi.string().max(50).allow('', null),
});

exports.emailConversationSchema = Joi.object({
  email_conversation_uuid: Joi.string().guid().max(50),
  subject: Joi.string().max(100),
  search_type: Joi.string().max(255).default('subject'),
  body: Joi.object().default(null), // JSON object type
  created_by_uuid: Joi.string().guid().max(50).allow('', null),
  created_by_name: Joi.string().max(50).allow('', null),
  modified_by_uuid: Joi.string().guid().allow('', null),
  modified_by_name: Joi.string().max(50).allow('', null),
});

exports.upsertstatusApproval = Joi.object({
  approval_uuid: Joi.string().guid().max(50).allow('', null),
  table_name: Joi.string().required(),
  record_uuid: Joi.string().guid().max(50).required(),
  record_id: Joi.number().integer().max(100).allow(null),
  record_column_name: Joi.string().allow('', null),
  approved_by_uuid: Joi.string().guid().max(50),
  requested_by_uuid: Joi.string().guid().max(50),
  previous_status: Joi.string(),
  status: Joi.string()
    .valid('REQUESTED', 'APPROVED', 'ROLLBACK', 'DECLINED')
    .required(),
  next_status: Joi.string(),
  created_by_uuid: Joi.string().guid().max(50).allow('', null),
});

exports.base64ToBufferSchema = Joi.object({
  base64Array: Joi.array().items(Joi.string()).min(1),
});

exports.upsertDocumentsSchema = Joi.object({
  documents_uuid: Joi.string().guid().allow('', null),
  document_name: Joi.string().allow('', null),
  file_path: Joi.string().allow('', null),
  description: Joi.string().allow('', null),
  record_uuid: Joi.string().guid().allow('', null),
  table_name: Joi.string().allow(null, ''),
  status: Joi.string().allow('', null),
  created_by_uuid: Joi.string().guid().max(50).allow(null),
  modified_by_uuid: Joi.string().guid().allow('', null),
});
exports.getDocumentsSchema = Joi.object({
  documents_uuid: Joi.string().guid().allow('', null),
  pageNo: Joi.number().integer().min(1),
  itemPerPage: Joi.number().integer().min(1),
  from_date: Joi.string().isoDate(),
  to_date: Joi.string().isoDate(),
  status: Joi.string(),
  columns: Joi.string(),
  value: Joi.string(),
});

exports.upsertCountryStateSchema = Joi.object({
  country_state_uuid: Joi.string().guid().allow('', null),
  country_id: Joi.number().integer().allow(null),
  country_name: Joi.string().required(),
  state_name: Joi.string().when('type', {
    is: Joi.string().valid('country'),
    then: Joi.string().allow('', null),
    otherwise: Joi.string().required(),
  }),
  country_code: Joi.string().allow('', null),
  state_code: Joi.string().allow('', null),
  type: Joi.string().allow('', null),
  latitude: Joi.string().allow(null),
  longitude: Joi.string().allow(null),
  status: Joi.string().allow('', null),
  created_by_uuid: Joi.string().guid().allow('', null),
  created_by_name: Joi.string().allow('', null),
  modified_by_uuid: Joi.string().guid().allow('', null),
  modified_by_name: Joi.string().allow('', null),
});

exports.getCountryStateSchema = Joi.object({
  country_state_uuid: Joi.string().guid(),
  country_id: Joi.number(),
  country_name: Joi.string(),
  state_name: Joi.string().when('type', {
    is: Joi.string().valid('country'),
    then: Joi.string().allow('', null),
    otherwise: Joi.string().required(),
  }),
  country_code: Joi.string(),
  state_code: Joi.string(),
  type: Joi.string(),
  status: Joi.string().valid('ACTIVE', 'INACTIVE', 'PENDING').allow(null),
  from_date: Joi.string().isoDate().allow(null),
  to_date: Joi.string().isoDate().allow(null),
  column: Joi.array().items(Joi.string()).allow(null),
  value: Joi.string().max(1000).allow(null),
  pageNo: Joi.number().integer().min(1).default(1),
  only_points: Joi.boolean().optional(),
  itemPerPage: Joi.number().integer().min(1).default(10),
  advanceFilter: Joi.array()
    .items(
      Joi.object({
        column: Joi.array().items(Joi.string()).required(),
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
          .required(),
        value: Joi.string().allow(null),
        logicalOperator: Joi.string().valid('AND', 'OR').required(),
      }),
    )
    .allow(null),
});