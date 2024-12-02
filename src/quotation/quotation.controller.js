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

exports.upsertQuotation = async (req, res) => {
  await isEditAccess('latest_quotation', req.user);
  removeNullValueKey(req.body);
  let isUpadtion = false;
  let old_quotation_date;
  let highest_quotation_no = await getHighestParameterValue(
    'latest_quotation',
    'quotation_no',
    `billing_company_branch_uuid='${req.body.billing_company_branch_uuid}'`,
  );
  highest_quotation_no.highestValue = highest_quotation_no.highestValue || '0';
  const quotation_no = incrementStringWithReset(
    highest_quotation_no.highestValue,
  );
  if (req.body.quotation_uuid) {
    isUpadtion = true;
    let quotation_info = await getRecords(
      'latest_quotation',
      `where quotation_uuid='${req.body.quotation_uuid}'`,
    );
    if (!quotation_info.length) throwError(404, 'Quotation not found.');
    quotation_info = quotation_info[0];
    quotation_info.create_ts = setDateTimeFormat(
      'timestemp',
      quotation_info.create_ts,
    );
    old_quotation_date = convertIsoUTCToLocalDate(
      quotation_info.quotation_date,
    );
    req.body = { ...quotation_info, ...req.body };
  } else {
    req.body.quotation_no = quotation_no;
    req.body.create_ts = setDateTimeFormat('timestemp');
    req.body.quotation_uuid = v4();
  }
  await insertRecords('quotation', req.body);
  //<------------ update analytics data for updates ------------>
  if (isUpadtion) {
    if (old_quotation_date != convertISOToDate(req.body.quotation_date)) {
      console.log(
        old_quotation_date,
        '-',
        convertISOToDate(req.body.quotation_date),
      );
      await dbRequest(
        `CALL analytics_quotation("${old_quotation_date}","${old_quotation_date}")`,
      );
    }
    await dbRequest(
      `CALL analytics_quotation("${convertISOToDate(
        req.body.quotation_date,
      )}","${convertISOToDate(req.body.quotation_date)}")`,
    );
  }

  res.json(responser('Quotation created successfully.', req.body));

  //<------------ handle quotation approval module properly ----------->
  const bodyData = {
    table_name: 'latest_quotation',
    record_uuid: req.body.quotation_uuid,
    record_column_name: 'quotation_uuid',
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

exports.getQuotation = async (req, res) => {
  const {
    combined_quotation_no,
    quotation_uuid,
    pageNo,
    itemPerPage,
    from_date,
    to_date,
    status,
    cancelled_status,
    columns,
    value,
  } = req.query;
  let tableName = 'latest_quotation';
  let filter = filterFunctionality(
    {
      combined_quotation_no,
      quotation_uuid,
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
  if (quotation_uuid) {
    const date_string = result[0].quotation_date.toISOString();
    result[0].quotation_date = date_string.split('T')[0];
  }
  return res.json(
    responser('Quotation : ', result, result.length, totalRecords),
  );
};
