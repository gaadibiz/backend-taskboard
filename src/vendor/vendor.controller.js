const {
  pagination,
  filterFunctionality,
  getCountRecord,
  getRecords,
  insertRecords,
  isEditAccess,
  roleFilterService,
} = require('../../utils/dbFunctions');

const {
  responser,
  removeNullValueKey,
  throwError,
  getData,
  setDateTimeFormat,
} = require('../../utils/helperFunction');
const { v4 } = require('uuid');
const { base_url } = require('../../config/server.config');
const { saveHistory } = require('../../utils/microservice_func');

exports.upsertVendor = async (req, res) => {
  await isEditAccess('latest_vendors', req.user);
  removeNullValueKey(req.body);

  let vendor_info = await getRecords(
    'latest_vendors',
    `where vendor_uuid='${req.body.vendor_uuid}'`,
  );

  if (req.body.vendor_uuid) {
    if (!vendor_info.length) throwError(404, 'Vendor not found.');
    vendor_info = vendor_info[0];
    vendor_info.create_ts = setDateTimeFormat(
      'timestemp',
      vendor_info.create_ts,
    );
    req.body = { ...vendor_info, ...req.body };
  } else {
    req.body.create_ts = setDateTimeFormat('timestemp');
    req.body.vendor_uuid = v4();
  }
  const insertResp = await insertRecords('vendors', req.body);

  saveHistory(
    {
      oldRecord: vendor_info,
      newRecord: req.body,
    },
    'vendors',
    'vendor_uuid',
    'vendor',
    insertResp.insertId,
    req.user,
  );

  res.json(responser('Vendor created or updated successfully.', req.body));

  //<------------ handle vendor approval module properly ----------->
  const bodyData = {
    table_name: 'latest_vendors',
    record_uuid: req.body.vendor_uuid,
    record_column_name: 'vendor_uuid',
  };
  getData(
    base_url + '/api/v1/approval/insert-approval',
    null,
    'json',
    bodyData,
    'POST',
    req.headers,
  );
};

exports.getVendor = async (req, res) => {
  const {
    vendor_uuid,
    billing_company_uuid,
    billing_company_branch_uuid,
    pageNo,
    itemPerPage,
    from_date,
    to_date,
    status,
    columns,
    value,
  } = req.query;

  let tableName = 'latest_vendors'; // Adjust the table name based on your naming conventions
  let filter = filterFunctionality(
    {
      vendor_uuid,
      billing_company_branch_uuid,
      billing_company_uuid,
    },
    status,
    to_date,
    from_date,
    Array.isArray(columns) ? columns : [columns],
    value,
  );

  // Apply additional filters or services if needed
  filter = await roleFilterService(filter, tableName, req.user);
  let pageFilter = pagination(pageNo, itemPerPage);
  let totalRecords = await getCountRecord(tableName, filter);
  let result = await getRecords(tableName, filter, pageFilter);

  return res.json(
    responser('All Vendors', result, result.length, totalRecords),
  );
};
