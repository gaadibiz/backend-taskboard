const Joi = require('joi');

exports.insertApprovalSchema = Joi.object({
  approval_uuid: Joi.string().guid().allow(null),
  table_name: Joi.string().required(),
  record_uuid: Joi.string().guid().required(),
  record_column_name: Joi.string().required(),
  approval_uuids: Joi.array()
    .min(1)
    .items(
      Joi.array().items(
        Joi.object({
          type: Joi.string().valid('USER', 'ROLE').required(), // Valid values: 'USER', 'ROLE'
          uuid: Joi.string().guid().required(),
        }),
      ),
    ),
  created_by_uuid: Joi.string().guid().allow(null),
  created_by_name: Joi.string().allow(null),
  modified_by_uuid: Joi.string().guid().allow(null),
  modified_by_name: Joi.string().allow(null),
});

exports.handleApprovalSchema = Joi.object({
  approval_uuid: Joi.string().guid().required(),
  remark: Joi.string().max(300).allow('', null),
  fields: Joi.object().allow(null),
  status: Joi.string().valid('APPROVED', 'REJECTED', 'ROLLBACK').required(),
  created_by_uuid: Joi.string().guid().allow(null),
  created_by_name: Joi.string().allow(null),
  modified_by_uuid: Joi.string().guid().allow(null),
  modified_by_name: Joi.string().allow(null),
});

exports.insertApprovalCountSchema = Joi.object({
  approval_count_uuid: Joi.string().guid().allow(null),
  table_name: Joi.string().required(),
  link_table: Joi.string().allow(null),
  link_column: Joi.when('link_table', {
    is: Joi.string().required(),
    then: Joi.string().required(),
    otherwise: Joi.string().allow(null),
  }),
  approval_hierarchy: Joi.array()
    .items(
      Joi.array()
        .min(1)
        .items(
          Joi.object({
            type: Joi.string().valid('USER', 'ROLE').required(),
            uuid: Joi.string().guid().required(),
          }),
        ),
    )
    .min(1),
  approval_raise_status: Joi.string()
    .regex(/_APPROVAL_REQUESTED$/)
    .required(),
  previous_status: Joi.string().required(),
  next_status: Joi.string().required(),
  status: Joi.string().valid('ACTIVE', 'INACTIVE').required(),
  created_by_uuid: Joi.string().guid().allow(null),
  created_by_name: Joi.string().allow(null),
  modified_by_uuid: Joi.string().guid().allow(null),
  modified_by_name: Joi.string().allow(null),
});

exports.insertApprovalAttachmentSchema = Joi.object({
  approval_attachment_uuid: Joi.string().guid().allow(null, ''),
  approval_uuid: Joi.string().guid().required(),
  approval_status: Joi.string().allow(null, ''),
  approval_next_status: Joi.string().allow(null, ''),
  approval_comment: Joi.string().allow(null, ''),
  user_comment: Joi.string().allow(null, ''),
  record_uuid: Joi.string().guid().allow(null, ''),
  attachment: Joi.array().allow(null, ''),
  status: Joi.string().valid('REQUESTED', 'FULFILLED').required(),
  created_by_uuid: Joi.string().guid().allow(null),
  created_by_name: Joi.string().allow(null),
  modified_by_uuid: Joi.string().guid().allow(null),
  modified_by_name: Joi.string().allow(null),
});
exports.getApprovalAttachmentSchema = Joi.object({
  approval_attachment_uuid: Joi.string().guid().allow(null),
  approval_uuid: Joi.string().guid().allow(null),
  record_uuid: Joi.string().guid().allow(null),
  pageNo: Joi.number().integer().min(1).allow(null),
  itemPerPage: Joi.number().integer().min(1).allow(null),
  record_uuid: Joi.string().guid().allow(null, ''),
  from_date: Joi.date().allow(null),
  to_date: Joi.date().allow(null),
  status: Joi.string().allow(null),
  columns: Joi.array().allow(null),
  value: Joi.string().allow(null),
});

exports.getApprovalHistorySchema = Joi.object({
  approval_uuid: Joi.string().guid().allow(null),
  record_uuid: Joi.string().guid().allow(null),
  requested_by_uuid: Joi.string().guid().allow(null),
  pageNo: Joi.number().integer().min(1).allow(null),
  itemPerPage: Joi.number().integer().min(1).allow(null),
  from_date: Joi.date().allow(null),
  to_date: Joi.date().allow(null),
  status: Joi.string().allow(null),
  columns: Joi.array().allow(null),
  value: Joi.string().allow(null),
});
