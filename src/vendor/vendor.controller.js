const {
  pagination,
  filterFunctionality,
  getCountRecord,
  getRecords,
  insertRecords,
  isEditAccess,
  roleFilterService,
  isValidRecord,
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
const { UUID, UUIDV4 } = require('sequelize');

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

exports.upsertVendorExpense = async (req, res) => {
  isEditAccess('latest_vendor_expense', req.user);
  removeNullValueKey(req.body);
  let isUpadtion = false;

  let expense_info = await getRecords(
    'latest_vendor_expense',
    `where vendor_expense_uuid='${req.body.vendor_expense_uuid}'`,
  );
  if (req.body.vendor_expense_uuid) {
    isUpadtion = true;

    if (!expense_info.length) throwError(404, 'expense_info not found.');
    expense_info = expense_info[0];
    req.body.modified_by_uuid = req.body.created_by_uuid;
    req.body.created_by_uuid = expense_info.created_by_uuid;
    req.body.created_by_name = expense_info.created_by_name;
    req.body = { ...expense_info, ...req.body };
    console.log('req.body in update: ', req.body);
  } else {
    req.body.create_ts = setDateTimeFormat('timestemp');
    req.body.vendor_expense_uuid = v4();
  }
  const insertexpense = await insertRecords('vendor_expense', req.body);

  saveHistory(
    {
      oldRecord: expense_info,
      newRecord: req.body,
    },
    'Vendor expense',
    'vendor_expense_uuid',
    'Vendor expense',
    insertexpense.insertId,
    req.user,
  );

  //<------------ handle costing sheet approval modal properly ----------->
  const bodyData = {
    table_name: 'latest_vendor_expense',
    dynamic_uuid: req.body.vendor_expense_category_uuid,
    record_uuid: req.body.vendor_expense_uuid,
    record_column_name: 'vendor_expense_uuid',
  };
  console.log('bodyData', bodyData);
  await getData(
    base_url + '/api/v1/dynamicApproval/insert-approval',
    null,
    'json',
    bodyData,
    'POST',
    req.headers,
  );

  return res.json(
    responser(
      `Vendor Expense ${isUpadtion ? 'updated' : 'created'} successfully.`,
      req.body,
    ),
  );
};

exports.getVendorExpense = async (req, res) => {
  const {
    vendor_expense_uuid,
    vendor_uuid,
    billing_company_uuid,
    pageNo,
    itemPerPage,
    from_date,
    to_date,
    status,
    columns,
    value,
  } = req.query;
  let tableName = 'latest_vendor_expense';
  let filter = filterFunctionality(
    {
      vendor_expense_uuid,
      vendor_uuid,
      billing_company_uuid,
    },
    status,
    to_date,
    from_date,
    Array.isArray(columns) ? columns : [columns],
    value,
  );
  filter = await roleFilterService(filter, tableName, req.user);
  let pageFilter = pagination(pageNo, itemPerPage);
  let totalRecords = await getCountRecord(tableName, filter);
  let result = await getRecords(tableName, filter, pageFilter);
  return res.json(
    responser('Vendor expense', result, result.length, totalRecords),
  );
};

exports.upsertVendorExpenseCategory = async (req, res) => {
  isEditAccess('latest_vendor_expense_category', req.user);
  // await isEditAccess('latest_expense_category', req.user);
  removeNullValueKey(req.body);
  req.body.vendor_expense_category_name =
    req.body.vendor_expense_category_name.toUpperCase();
  let isUpadtion = false;

  let isExist = await isValidRecord('latest_vendor_expense_category', {
    vendor_expense_category_uuid: req.body.vendor_expense_category_uuid,
  });

  if (req.body.vendor_expense_category_uuid) {
    if (!isExist) throwError(404, 'expense_category not found.');
    isUpadtion = true;
    let expense_category_info = await getRecords(
      'latest_vendor_expense_category',
      `where vendor_expense_category_uuid='${req.body.vendor_expense_category_uuid}'`,
    );
    expense_category_info = expense_category_info[0];
    req.body.created_by_uuid = expense_category_info.created_by_uuid;
    req.body.created_by_name = expense_category_info.created_by_name;
    req.body = { ...expense_category_info, ...req.body };
  } else {
    let isExist = await isValidRecord('latest_vendor_expense_category', {
      vendor_expense_category_name: req.body.vendor_expense_category_name,
    });

    if (isExist) throwError(404, 'expense_category is already exists.');
    req.body.vendor_expense_category_uuid = v4();
    req.body.create_ts = setDateTimeFormat('timestemp');
    // add defult approval
    let roles = await getRecords(
      'latest_roles',
      `where role_value IN ('PROJECT_MANAGER', 'CEO', 'CATEGORY_MANAGER', 'FINANCE_MANAGER')`,
    );
    let role_info_project_manager = roles.find(
      (role) => role.role_value === 'PROJECT_MANAGER',
    );
    let role_info_ceo = roles.find((role) => role.role_value === 'CEO');
    let role_info_category_manager = roles.find(
      (role) => role.role_value === 'CATEGORY_MANAGER',
    );
    let role_info_finance_manager = roles.find(
      (role) => role.role_value === 'FINANCE_MANAGER',
    );

    // const defultapproval = [{}, {}];
    const data1 = {
      dynamic_approval_count_uuid: v4(),
      table_name: 'latest_vendor_expense',
      dynamic_uuid: req.body.vendor_expense_category_uuid,
      dynamic_table_name: 'latest_vendor_expense_category',
      level: 1,
      approval_hierarchy: [
        [
          {
            type: 'ROLE',
            uuid: `${role_info_finance_manager.role_uuid}`,
            is_conditional: false,
          },
        ],
      ],
      approval_raise_status: 'FINANCE_APPROVAL_REQUESTED',
      previous_status: 'EXPENSE_REQUESTED',
      next_status: 'FINANCE_APPROVED',
      status: 'ACTIVE',
      created_by_uuid: req.body.created_by_uuid,
    };

    // let insert_dynamic_approval1 = await insertRecords('dynamic_approval_count', data1);

    const data2 = {
      dynamic_approval_count_uuid: v4(),
      table_name: 'latest_vendor_expense',
      dynamic_uuid: req.body.vendor_expense_category_uuid,
      dynamic_table_name: 'latest_vendor_expense_category',
      level: 3,
      approval_hierarchy: [
        [
          {
            type: 'ROLE',
            uuid: `${role_info_project_manager.role_uuid}`,
            is_conditional: false,
          },
        ],
        [
          {
            type: 'ROLE',
            uuid: `${role_info_category_manager.role_uuid}`,
            is_conditional: false,
          },
        ],
        [
          {
            type: 'ROLE',
            uuid: `${role_info_ceo.role_uuid}`,
            is_conditional: true,
            filter: [
              {
                column: 'actual_reimbursed_amount',
                operator: 'GREATER_THAN_EQUAL',
                value: '10000',
              },
              {
                column: 'actual_requested_advance_amount',
                operator: 'GREATER_THAN_EQUAL',
                value: '10000',
                logicalOperator: 'OR',
              },
            ],
          },
        ],
      ],

      approval_raise_status: 'EXPENSE_APPROVAL_REQUESTED',
      previous_status: 'EXPENSE_REQUESTED',
      next_status: 'FINANCE_APPROVAL_REQUESTED',
      status: 'ACTIVE',
      created_by_uuid: req.body.created_by_uuid,
    };
    const insertapproval = [data1, data2];

    let insert_dynamic_approval2 = await insertRecords(
      'dynamic_approval_count',
      insertapproval,
    );
  }
  let expense_category = await insertRecords(
    'vendor_expense_category',
    req.body,
  );

  saveHistory(
    {
      oldRecord: isExist,
      newRecord: req.body,
    },
    'vendor_expense_category',
    'vendor_expense_category_uuid',
    'Vendor Expense Category',
    expense_category.insertId,
    req.user,
  );

  res.json(
    responser(
      ` Vendor expense category ${isUpadtion ? 'updated' : 'created'} successfully.`,
      req.body,
    ),
  );
};

exports.getVendorExpenseCategory = async (req, res) => {
  const {
    vendor_expense_category_uuid,
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

  let tableName = 'latest_vendor_expense_category';
  let filter = filterFunctionality(
    {
      vendor_expense_category_uuid,
      billing_company_uuid,
      billing_company_branch_uuid,
    },
    status,
    to_date,
    from_date,
    Array.isArray(columns) ? columns : [columns],
    value,
  );
  filter = await roleFilterService(filter, tableName, req.user);
  let pageFilter = pagination(pageNo, itemPerPage);
  let totalRecords = await getCountRecord(tableName, filter);
  let result = await getRecords(tableName, filter, pageFilter);
  return res.json(
    responser(
      'All Vendor expense category',
      result,
      result.length,
      totalRecords,
    ),
  );
};
