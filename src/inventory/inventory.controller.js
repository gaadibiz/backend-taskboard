const {
  pagination,
  filterFunctionality,
  getCountRecord,
  getRecords,
  insertRecords,
  getLatestParameterValue,
  dbRequest,
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

exports.upsertInventory = async (req, res) => {
  await isEditAccess('latest_inventory', req.user);
  removeNullValueKey(req.body);
  let isUpadtion = false;
  if (req.body.inventory_uuid) {
    isUpadtion = true;
    let inventory_info = await getRecords(
      'latest_inventory',
      `where inventory_uuid='${req.body.inventory_uuid}'`,
    );
    if (!inventory_info.length) throwError(404, 'inventory not found.');
    inventory_info = inventory_info[0];
    req.body = { ...inventory_info, ...req.body };
  } else {
    req.body.create_ts = setDateTimeFormat('timestemp');
    req.body.inventory_uuid = v4();
    req.body.product_for_uuid = v4();
  }
  await insertRecords('inventory', req.body);
  res.json(responser('inventory created or updated successfully.', req.body));

  //<------------ handle inventory approval module properly ----------->
  const bodyData = {
    table_name: 'latest_inventory',
    record_uuid: req.body.inventory_uuid,
    record_column_name: 'inventory_uuid',
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

exports.getInventory = async (req, res) => {
  const {
    inventory_uuid,
    pageNo,
    itemPerPage,
    from_date,
    to_date,
    status,
    cancelled_status,
    columns,
    value,
  } = req.query;

  let tableName = 'latest_inventory'; // Adjust the table name based on your naming conventions
  let filter = filterFunctionality(
    {
      inventory_uuid,
    },
    status,
    to_date,
    from_date,
    Array.isArray(columns) ? columns : [columns],
    value,
  );

  if (cancelled_status === 'TRUE' && status) {
    const status_array = filter.split('status=');
    filter =
      status_array[0] + "status='CANCELLED' OR status=" + status_array[1];
  }

  // Apply additional filters or services if needed
  filter = await roleFilterService(filter, tableName, req.user);
  let pageFilter = pagination(pageNo, itemPerPage);
  let totalRecords = await getCountRecord(tableName, filter);
  let result = await getRecords(tableName, filter, pageFilter);
  if (inventory_uuid) {
    const date_string = result[0].dated.toISOString();
    result[0].dated = date_string.split('T')[0];
  }
  return res.json(
    responser('All Inventory', result, result.length, totalRecords),
  );
};

exports.deleteInventory = async (req, res) => {
  if (req.body.inventory_uuid) {
    let inventory_info = await getRecords(
      'latest_inventory',
      `where inventory_uuid='${req.body.inventory_uuid}'`,
    );
    if (!inventory_info.length) throwError(404, 'inventory not found.');
    inventory_info = inventory_info[0];
    inventory_info.create_ts = setDateTimeFormat(
      'timestemp',
      inventory_info.create_ts,
    );
    req.body = { ...inventory_info, ...req.body };
    req.body.status = 'DELETED';

    let ledgerData = await getRecords(
      'latest_ledger',
      `where invoice_uuid='${req.body.inventory_uuid}'`,
    );
    if (ledgerData.length) {
      for (let index = 0; index < ledgerData.length; index++) {
        const element = ledgerData[index];
        const product_balance = await getRecords(
          'latest_ledger',
          `where product_uuid="${element.product_uuid}"`,
        );
        let ledgerBodyData = {
          quantity: element.quantity,
          balance: (
            Number(product_balance[0].balance) + Number(element.quantity)
          ).toString(),
          status: 'DELETED',
        };
        ledgerBodyData = { ...element, ...ledgerBodyData };
        await insertRecords('ledgers', ledgerBodyData);
      }
    }
    await insertRecords('inventory', req.body);
  }
  return res.json(responser('Inventory Deleted Successfully :', req.body));
};
