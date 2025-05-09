const {
  pagination,
  filterFunctionality,
  getCountRecord,
  getRecords,
  insertRecords,
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

exports.upsertBillingCompany = async (req, res) => {
  removeNullValueKey(req.body);
  if (req.body.billing_company_uuid) {
    let billingCompany_info = await getRecords(
      'latest_billing_company',
      `where billing_company_uuid='${req.body.billing_company_uuid}'`,
    );
    if (!billingCompany_info.length)
      throwError(404, 'Billing Company not found.');
    billingCompany_info = billingCompany_info[0];
    billingCompany_info.create_ts = setDateTimeFormat(
      'timestemp',
      billingCompany_info.create_ts,
    );
    req.body = { ...billingCompany_info, ...req.body };
  } else {
    req.body.create_ts = setDateTimeFormat('timestemp');
    req.body.billing_company_uuid = v4();
  }
  await insertRecords('billing_company', req.body);
  res.json(
    responser('Billing Company created or updated successfully.', req.body),
  );
};

exports.getBillingCompany = async (req, res) => {
  const {
    billing_company_uuid,
    pageNo,
    itemPerPage,
    from_date,
    to_date,
    status,
    columns,
    value,
  } = req.query;

  let tableName = 'latest_billing_company'; // Adjust the table name based on your naming conventions
  let filter = filterFunctionality(
    {
      billing_company_uuid,
    },
    status,
    to_date,
    from_date,
    Array.isArray(columns) ? columns : [columns],
    value,
  );

  // Apply additional filters or services if needed

  let pageFilter = pagination(pageNo, itemPerPage);
  let totalRecords = await getCountRecord(tableName, filter);
  let result = await getRecords(tableName, filter, pageFilter);

  return res.json(
    responser('All Billing Companies', result, result.length, totalRecords),
  );
};
