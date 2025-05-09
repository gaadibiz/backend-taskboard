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

exports.upsertLedger = async (req, res) => {
  await isEditAccess('latest_ledger', req.user);
  removeNullValueKey(req.body);
  if (req.body.ledger_uuid) {
    let ledger_info = await getRecords(
      'latest_ledger',
      `where ledger_uuid='${req.body.ledger_uuid}'`,
    );
    if (!ledger_info.length) throwError(404, 'ledger not found.');
    ledger_info = ledger_info[0];
    ledger_info.create_ts = setDateTimeFormat(
      'timestemp',
      ledger_info.create_ts,
    );
    req.body = { ...ledger_info, ...req.body };
  } else {
    req.body.create_ts = setDateTimeFormat('timestemp');
    req.body.ledger_uuid = v4();
  }
  await insertRecords('ledgers', req.body);
  res.json(responser('ledger created or updated successfully.', req.body));
};

exports.getLedger = async (req, res) => {
  const {
    ledger_uuid,
    product_uuid, // Add the product_uuid query parameter
    pageNo,
    itemPerPage,
    from_date,
    to_date,
    status,
    columns,
    value,
  } = req.query;

  let tableName = 'latest_ledger'; // Adjust the table name based on your naming conventions
  let filter = filterFunctionality(
    {
      ledger_uuid,
      product_uuid,
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
    responser('All Ledgers', result, result.length, totalRecords),
  );
};
