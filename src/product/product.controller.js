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

exports.upsertProduct = async (req, res) => {
  await isEditAccess('latest_product', req.user);
  removeNullValueKey(req.body);
  if (req.body.product_uuid) {
    let product_info = await getRecords(
      'latest_product',
      `where product_uuid='${req.body.product_uuid}'`,
    );
    if (!product_info.length) throwError(404, 'product not found.');
    product_info = product_info[0];
    product_info.create_ts = setDateTimeFormat(
      'timestemp',
      product_info.create_ts,
    );
    req.body = { ...product_info, ...req.body };
  } else {
    req.body.create_ts = setDateTimeFormat('timestemp');
    req.body.product_uuid = v4();
  }
  await insertRecords('products', req.body);
  res.json(responser('product created or updated successfully.', req.body));

  //<------------ handle product approval module properly ----------->
  const bodyData = {
    table_name: 'latest_product',
    record_uuid: req.body.product_uuid,
    record_column_name: 'product_uuid',
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

exports.getProduct = async (req, res) => {
  const {
    product_uuid,
    billing_company_uuid,
    pageNo,
    itemPerPage,
    from_date,
    to_date,
    status,
    columns,
    value,
    ledger_info,
  } = req.query;

  let tableName = 'latest_product'; // Adjust the table name based on your naming conventions
  let filter = filterFunctionality(
    {
      product_uuid,
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

  if (ledger_info == 1) {
    for (let i = 0; i < result.length; i++) {
      let balanceDetails = await getRecords(
        'latest_ledger',
        `where product_uuid='${result[i].product_uuid}' LIMIT 1`,
      );
      if (balanceDetails.length > 0) {
        result[i].ledger_quantity = balanceDetails[0].balance;
      } else {
        result[i].ledger_quantity = '0';
      }
    }
  }
  return res.json(
    responser('All Products', result, result.length, totalRecords),
  );
};

exports.getStockInfo = async (req, res) => {
  const { product_uuid, product_name, billing_company_uuid } = req.query;

  let result = await getRecords(
    'latest_ledger',
    `where product_uuid="${product_uuid}" OR selling_name="${product_name}" AND billing_company_uuid="${billing_company_uuid}"`,
    '',
    ['balance'],
  );
  if (!result.length)
    result[0] = {
      balance: '0',
    };

  return res.json(responser('Stock Info', ...result));
};
