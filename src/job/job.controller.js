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

exports.upsertJob = async (req, res) => {
  await isEditAccess('latest_job', req.user);
  removeNullValueKey(req.body);
  let isUpadtion = false;
  let old_job_date;
  let highest_job_no = await getHighestParameterValue(
    'latest_job',
    'CAST(job_order_no AS UNSIGNED)',
    '1=1',
  );
  console.log('highest_job_no.highestValue', highest_job_no);
  highest_job_no.highestValue = highest_job_no.highestValue || '0';
  const job_order_no = incrementStringWithReset(highest_job_no.highestValue);
  console.log('job_order_no', job_order_no);
  if (req.body.job_uuid) {
    isUpadtion = true;
    let job_info = await getRecords(
      'latest_job',
      `where job_uuid='${req.body.job_uuid}'`,
    );
    if (!job_info.length) throwError(404, 'job not found.');
    job_info = job_info[0];
    job_info.create_ts = setDateTimeFormat('timestemp', job_info.create_ts);
    old_job_date = convertIsoUTCToLocalDate(job_info.job_date);
    req.body = { ...job_info, ...req.body };
  } else {
    req.body.job_order_no = job_order_no;
    req.body.create_ts = setDateTimeFormat('timestemp');
    req.body.job_uuid = v4();
  }
  await insertRecords('job', req.body);

  //<------------ handle job approval module properly ----------->
  const bodyData = {
    table_name: 'latest_job',
    record_uuid: req.body.job_uuid,
    record_column_name: 'job_uuid',
  };
  getData(
    base_url + '/api/v1/approval/insert-approval',
    null,
    'json',
    bodyData,
    'POST',
    req.headers,
  );

  //<------------ update analytics data for updates ------------>
  // if (isUpadtion) {
  //   if (old_job_date != convertISOToDate(req.body.job_date)) {
  //     console.log(old_job_date, '-', convertISOToDate(req.body.job_date));
  //     await dbRequest(
  //       `CALL analytics_job("${old_job_date}","${old_job_date}")`,
  //     );
  //   }
  //   await dbRequest(
  //     `CALL analytics_job("${convertISOToDate(
  //       req.body.job_date,
  //     )}","${convertISOToDate(req.body.job_date)}")`,
  //   );
  // }

  res.json(responser('job created successfully.', req.body));
};

exports.getJob = async (req, res) => {
  const {
    job_uuid,
    job_order_no,
    project_uuid,
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
  let tableName = 'latest_job';
  let filter = filterFunctionality(
    {
      job_uuid,
      job_order_no,
      project_uuid,
      billing_company_uuid,
      billing_company_branch_uuid,
    },
    status,
    to_date,
    from_date,
    Array.isArray(columns) ? columns : [columns],
    value,
  );

  // / self draft filter
  filter +=
    (filter ? ' AND ' : ' WHERE ') +
    `(
    status != 'DRAFT' OR (
      status = 'DRAFT' AND (
        created_by_uuid = '${req.user.user_uuid}' 
      )
    )
  )`;

  filter = await roleFilterService(filter, tableName, req.user);
  let pageFilter = pagination(pageNo, itemPerPage);
  let totalRecords = await getCountRecord(tableName, filter);
  let result = await getRecords(tableName, filter, pageFilter);

  if (result.length > 0) {
    // // merge approval record logic
    mergeExpense = await getData(
      base_url + '/api/v1/approval/merge-approval-record',
      null,
      'json',
      {
        record_uuid: result[0].job_uuid,
        table_name: tableName,
        data: result[0],
      },
      'POST',
      req.headers,
    );
    // Update the first order with response data
    if (mergeExpense) {
      const { approval_uuid, requested_by_uuid, is_user_approver } =
        mergeExpense; // Destructure for direct assignments
      Object.assign(result[0], {
        approval_uuid,
        requested_by_uuid,
        is_user_approver,
      });
    }
  }

  return res.json(responser('job : ', result, result.length, totalRecords));
};
