const {
  pagination,
  filterFunctionality,
  getCountRecord,
  getRecords,
  insertRecords,
  isValidRecord,
} = require('../../utils/dbFunctions');

const {
  responser,
  removeNullValueKey,
  setDateTimeFormat,
  throwError,
  getData,
} = require('../../utils/helperFunction');
const { v4 } = require('uuid');

const uuid = v4;

exports.upsertComment = async (req, res) => {
  removeNullValueKey(req.body);
  if (req.body.comment_t_uuid) {
    let comment_info = await getRecords(
      'latest_comment_t',
      `where comment_t_uuid='${req.body.comment_t_uuid}'`,
    );
    if (!comment_info.length) throwError(404, 'comment  not found.');
    comment_info = comment_info[0];
    req.body.modified_by_uuid = req.body.created_by_uuid;
    req.body.created_by_uuid = comment_info.created_by_uuid;
    req.body = { ...comment_info, ...req.body };
  } else {
    req.body.create_ts = setDateTimeFormat('timestemp');
    req.body.comment_t_uuid = uuid();
  }
  await insertRecords('comment_t', req.body);
  req.body.create_ts = new Date(req.body.create_ts).toISOString();
  res.json(responser('Comment created or updated successfully.', req.body));
};

exports.getComment = async (req, res) => {
  const {
    comment_t_id,
    comment_t_uuid,
    parent_module_no,
    module_uuid,
    pageNo,
    itemPerPage,
    from_date,
    to_date,
    status,
    columns,
    value,
  } = req.query;

  let tableName = 'latest_comment_t';
  let filter = filterFunctionality(
    {
      comment_t_id,
      comment_t_uuid,
      parent_module_no,
      module_uuid,
    },
    status,
    to_date,
    from_date,
    Array.isArray(columns) ? columns : [columns],
    value,
  );

  let pageFilter = pagination(pageNo, itemPerPage);
  let totalRecords = await getCountRecord(tableName, filter);
  let result = await getRecords(tableName, filter, pageFilter);
  return res.json(responser('Comment: ', result, result.length, totalRecords));
};
