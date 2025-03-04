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

exports.upsertCategory = async (req, res) => {
  removeNullValueKey(req.body);
  if (req.body.category_uuid) {
    let category_info = await getRecords(
      'latest_category',
      `where category_uuid='${req.body.category_uuid}'`,
    );
    if (!category_info.length) throwError(404, 'category  not found.');
    category_info = category_info[0];
    req.body.modified_by_uuid = req.body.created_by_uuid;
    req.body.created_by_uuid = category_info.created_by_uuid;
    req.body = { ...category_info, ...req.body };
  } else {
    req.body.create_ts = setDateTimeFormat('timestemp');
    req.body.category_uuid = uuid();
  }
  await insertRecords('category', req.body);
  res.json(responser('category created or updated successfully.', req.body));
};

exports.getCategory = async (req, res) => {
  const {
    category_id,
    category_uuid,
    pageNo,
    itemPerPage,
    from_date,
    to_date,
    status,
    columns,
    value,
  } = req.query;

  let tableName = 'latest_category';
  let filter = filterFunctionality(
    {
      category_id,
      category_uuid,
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
  return res.json(responser('Category: ', result, result.length, totalRecords));
};
