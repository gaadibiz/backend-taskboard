const { v4 } = require('uuid');
const {
  pagination,
  filterFunctionality,
  getCountRecord,
  getRecords,
  insertRecords,
  getHighestParameterValue,
  isEditAccess,
  roleFilterService,
  dbRequest,
  isRecordExist,
} = require('../../utils/dbFunctions');
const {
  responser,
  removeNullValueKey,
  setDateTimeFormat,
  throwError,
  incrementStringWithReset,
  getData,
} = require('../../utils/helperFunction');

const { base_url } = require('../../config/server.config');

exports.upsertGRN = async (req, res) => {
  await isEditAccess('latest_grn', req.user);
  removeNullValueKey(req.body);
  let isUpadtion = false;
  let highest_grn_no = await getHighestParameterValue(
    'latest_grn',
    'grn_no',
    `billing_company_branch_uuid='${req.body.billing_company_branch_uuid}'`,
  );
  highest_grn_no.highestValue = highest_grn_no.highestValue || '0';
  const grn_no = incrementStringWithReset(highest_grn_no.highestValue);
  if (req.body.grn_uuid) {
    isUpadtion = true;
    let grn_info = await getRecords(
      'latest_grn',
      `where grn_uuid='${req.body.grn_uuid}'`,
    );
    if (!grn_info.length) throwError(404, 'Goods Recieving Note not found.');
    grn_info = grn_info[0];
    grn_info.create_ts = setDateTimeFormat('timestemp', grn_info.create_ts);
    req.body = { ...grn_info, ...req.body };
  } else {
    req.body.grn_no = grn_no;
    req.body.create_ts = setDateTimeFormat('timestemp');
    req.body.grn_uuid = v4();
  }
  await insertRecords('grn', req.body);

  //Updating the ledger table now.
  req.body.invoice_items.forEach(async (element) => {
    if (element.product_uuid || !element.product_uuid == '') {
      dbRequest(`
        CALL proc_insert_ledger('${req.body.grn_uuid}',
                                '${element.product_uuid}',
                                 ${element.quantity},
                                '${req.body.billing_company_uuid}',
                                '${req.body.vendor_name}',
                                'IN','')`);
    }
  });
  res.json(responser('Goods Recieving Note created successfully.', req.body));

  //<------------ handle quotation approval module properly ----------->
  const bodyData = {
    table_name: 'latest_grn',
    record_uuid: req.body.grn_uuid,
    record_column_name: 'grn_uuid',
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

exports.getGRN = async (req, res) => {
  const {
    combined_grn_no,
    grn_uuid,
    billing_company_uuid,
    pageNo,
    itemPerPage,
    from_date,
    to_date,
    status,
    cancelled_status,
    columns,
    value,
  } = req.query;
  let tableName = 'latest_grn';
  let filter = filterFunctionality(
    {
      combined_grn_no,
      grn_uuid,
      billing_company_uuid,
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
  filter = await roleFilterService(filter, tableName, req.user);
  let pageFilter = pagination(pageNo, itemPerPage, 'create_ts');
  let totalRecords = await getCountRecord(tableName, filter);
  let result = await getRecords(tableName, filter, pageFilter);
  if (grn_uuid) {
    const date_string = result[0].grn_date.toISOString();
    result[0].grn_date = date_string.split('T')[0];
  }
  if (result.length) {
    const updatedResult = await Promise.all(
      result.map(async (element) => {
        const purchase_invoice_no = await getRecords(
          'latest_inventory',
          `where grn_uuid='${element.grn_uuid}'`,
        );
        element.purchase_invoice_no = purchase_invoice_no.length
          ? purchase_invoice_no[0].inv_invoice_no
          : 'PENDING';
        return element;
      }),
    );

    result = updatedResult; // Only if you need to update the original `result` array.
  }

  return res.json(
    responser('Goods Recieving Note : ', result, result.length, totalRecords),
  );
};
