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
} = require('../../utils/dbFunctions');
const {
  responser,
  removeNullValueKey,
  setDateTimeFormat,
  throwError,
  incrementStringWithReset,
  getData,
  convertISOToDate,
  convertIsoUTCToLocalDate,
} = require('../../utils/helperFunction');

const { base_url } = require('../../config/server.config');

exports.upsertSaleOrder = async (req, res) => {
  await isEditAccess('latest_sale_order', req.user);
  removeNullValueKey(req.body);
  let isUpadtion = false;
  let old_sale_order_date;
  let highest_sale_order_no = await getHighestParameterValue(
    'latest_sale_order',
    'sale_order_no',
    `billing_company_branch_uuid='${req.body.billing_company_branch_uuid}'`,
  );
  highest_sale_order_no.highestValue =
    highest_sale_order_no.highestValue || '0';
  const sale_order_no = incrementStringWithReset(
    highest_sale_order_no.highestValue,
  );
  if (req.body.sale_order_uuid) {
    isUpadtion = true;
    let sale_order_info = await getRecords(
      'latest_sale_order',
      `where sale_order_uuid='${req.body.sale_order_uuid}'`,
    );
    if (!sale_order_info.length) throwError(404, 'Sale Order not found.');
    sale_order_info = sale_order_info[0];
    sale_order_info.create_ts = setDateTimeFormat(
      'timestemp',
      sale_order_info.create_ts,
    );
    old_sale_order_date = convertIsoUTCToLocalDate(
      sale_order_info.sale_order_date,
    );
    req.body = { ...sale_order_info, ...req.body };
  } else {
    req.body.sale_order_no = sale_order_no;
    req.body.create_ts = setDateTimeFormat('timestemp');
    req.body.sale_order_uuid = v4();
  }
  await insertRecords('sale_order', req.body);
  //<------------ update analytics data for updates ------------>
  if (isUpadtion) {
    if (old_sale_order_date != convertISOToDate(req.body.sale_order_date)) {
      console.log(
        old_sale_order_date,
        '-',
        convertISOToDate(req.body.sale_order_date),
      );
      await dbRequest(
        `CALL analytics_sale_order("${old_sale_order_date}","${old_sale_order_date}")`,
      );
    }
    await dbRequest(
      `CALL analytics_sale_order("${convertISOToDate(
        req.body.sale_order_date,
      )}","${convertISOToDate(req.body.sale_order_date)}")`,
    );
  }

  res.json(responser('Sale Order created successfully.', req.body));

  //<------------ handle quotation approval module properly ----------->
  const bodyData = {
    table_name: 'latest_sale_order',
    record_uuid: req.body.sale_order_uuid,
    record_column_name: 'sale_order_uuid',
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

exports.getSaleOrder = async (req, res) => {
  const {
    combined_sale_order_no,
    sale_order_uuid,
    pageNo,
    itemPerPage,
    from_date,
    to_date,
    status,
    cancelled_status,
    columns,
    value,
  } = req.query;
  let tableName = 'latest_sale_order';
  let filter = filterFunctionality(
    {
      combined_sale_order_no,
      sale_order_uuid,
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
  if (sale_order_uuid) {
    const date_string = result[0].sale_order_date.toISOString();
    result[0].sale_order_date = date_string.split('T')[0];
  }
  return res.json(
    responser('Sale Order : ', result, result.length, totalRecords),
  );
};
