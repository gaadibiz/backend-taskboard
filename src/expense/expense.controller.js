const { v4: uuid } = require('uuid');
const fs = require('fs');

const {
  pagination,
  filterFunctionality,
  getCountRecord,
  getRecords,
  insertRecords,
  isValidRecord,
  roleFilterService,
  isEditAccess,
  advanceFiltering,
  countTypesInColumn,
  insertRecordHandleIncremental,
  dbRequest,
} = require('../../utils/dbFunctions');
const {
  generateCode,
  setDateTimeFormat,
  deleteKeyValuePair,
  throwError,
  getData,
} = require('../../utils/helperFunction');
const { base_url } = require('../../config/server.config');
const { responser, removeNullValueKey } = require('../../utils/helperFunction');

const {
  saveHistory,
  ejsPreview,
  pdfMaker,
} = require('../../utils/microservice_func');

function toBoolean(value) {
  if (value === 'true' || value === true || value === 1) return true;
  if (value === 'false' || value === false || value === 0) return false;
  return Boolean(value); // Fallback for other truthy/falsy values
}

exports.upsertExpense = async (req, res) => {
  isEditAccess('latest_expense', req.user);
  removeNullValueKey(req.body);
  let isUpadtion = false;

  let expense_info = await getRecords(
    'latest_expense',
    `where expense_uuid='${req.body.expense_uuid}'`,
  );
  if (req.body.expense_uuid) {
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
    req.body.expense_uuid = uuid();
  }
  const insertexpense = await insertRecords('expense', req.body);

  saveHistory(
    {
      oldRecord: expense_info,
      newRecord: req.body,
    },
    'expense',
    'expense_uuid',
    'expense',
    insertexpense.insertId,
    req.user,
  );

  //<------------ handle costing sheet approval modal properly ----------->
  const bodyData = {
    table_name: 'latest_expense',
    dynamic_uuid: req.body.expense_category_uuid,
    record_uuid: req.body.expense_uuid,
    record_column_name: 'expense_uuid',
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

  if (req.body.reimbursed_amount > 10000) {
    console.log('approval for the admin');
  }

  res.json(responser('expense created or updated successfully.', req.body));

  // res.json(responser('expense created or updated successfully.', req.body));

  // <---------------- history entry ---------------->
  (async () => {
    try {
      let historyMessage = '';
      let userInfo = (
        await getRecords(
          'latest_user',
          `where user_uuid= '${req.body.created_by_uuid}'`,
        )
      )[0];
      if (isUpadtion) {
        historyMessage = `${userInfo?.first_name} has made an update in expense.`;
      } else {
        historyMessage = `${userInfo?.first_name} has created a expense.`;
      }
      const moduleId = insertexpense.insertId;
      const bodyData = {
        module_name: 'Expense',
        module_uuid: req.body.expense_uuid,
        module_id: moduleId,
        message: historyMessage,
        module_column_name: 'expense_uuid',
        created_by_uuid: req.body.created_by_uuid,
        modified_by_uuid: req.body.modified_by_uuid,
      };
      await getData(
        base_url + '/api/v1/history/upsert-history',
        null,
        'json',
        bodyData,
        'POST',
      );
    } catch (error) {
      console.log(error);
    }
  })();
};

exports.getExpense = async (req, res) => {
  const {
    expense_uuid,
    project_uuid,
    expense_category_uuid,
    billing_company_uuid,
    billing_company_branch_uuid,
    pageNo,
    itemPerPage,
    from_date,
    to_date,
    status,
    columns,
    value,
    pageLimit,
    advanceFilter,
    is_type_expense,
    is_type_advance,
    is_type_job,
  } = req.query;

  console.log('req.query---->', req.query);

  let tableName = 'latest_expense';
  let filter = filterFunctionality(
    {
      expense_uuid,
      project_uuid,
      expense_category_uuid,
      billing_company_uuid,
      billing_company_branch_uuid,
    },
    status,
    to_date,
    from_date,
    Array.isArray(columns) ? columns : [columns],
    value,
    advanceFilter,
  );

  let condition = '';

  if (toBoolean(is_type_expense)) {
    condition += (condition ? ' OR ' : '') + "expense_type = 'EXPENSE'";
  }
  if (toBoolean(is_type_advance)) {
    condition += (condition ? ' OR ' : '') + "expense_type = 'ADVANCE'";
  }
  if (toBoolean(is_type_job)) {
    condition += (condition ? ' OR ' : '') + "expense_type = 'JOB'";
  }

  if (condition) {
    filter += (filter ? ' AND ' : ' WHERE ') + `(${condition})`;
  }

  // self draft filter
  filter +=
    (filter ? ' AND ' : ' WHERE ') +
    `(
    status != 'expense_requested' OR (
      status = 'expense_requested' AND (
        created_by_uuid = '${req.user.user_uuid}' OR user_uuid = '${req.user.user_uuid}'
      )
    )
  )`;

  if (advanceFilter) filter = advanceFiltering(filter, advanceFilter);
  console.log('filter', filter);

  filter = await roleFilterService(filter, 'latest_expense', req.user);
  let pageFilter = pagination(pageNo, itemPerPage, pageLimit);
  let totalRecords = await getCountRecord(tableName, filter);
  let result = await getRecords(tableName, filter, pageFilter);

  if (result.length > 0) {
    // // merge approval record logic
    mergeExpense = await getData(
      base_url + '/api/v1/dynamicApproval/merge-approval-record',
      null,
      'json',
      {
        record_uuid: result[0].expense_uuid,
        dynamic_uuid: result[0].expense_category_uuid,
        table_name: tableName,
        data: {},
      },
      'POST',
      req.headers,
    );

    console.log('MERGER ------>', mergeExpense);
    // Update the first order with response data
    if (mergeExpense) {
      const { dynamic_approval_uuid, requested_by_uuid, is_user_approver } =
        mergeExpense; // Destructure for direct assignments
      Object.assign(result[0], {
        dynamic_approval_uuid,
        requested_by_uuid,
        is_user_approver,
      });
    }
  }

  return res.json(responser('expense: ', result, result.length, totalRecords));
};

// // res.json(responser('Project created or updated successfully.', req.body));

exports.upsertExpenseCategory = async (req, res) => {
  isEditAccess('latest_expense_category', req.user);
  // await isEditAccess('latest_expense_category', req.user);
  removeNullValueKey(req.body);
  req.body.expense_category_name = req.body.expense_category_name.toUpperCase();
  let isUpadtion = false;

  let isExist = await isValidRecord('latest_expense_category', {
    expense_category_uuid: req.body.expense_category_uuid,
  });

  if (req.body.expense_category_uuid) {
    if (!isExist) throwError(404, 'expense_category not found.');
    isUpadtion = true;
    let expense_category_info = await getRecords(
      'latest_expense_category',
      `where expense_category_uuid='${req.body.expense_category_uuid}'`,
    );
    expense_category_info = expense_category_info[0];
    req.body.created_by_uuid = expense_category_info.created_by_uuid;
    req.body.created_by_name = expense_category_info.created_by_name;
    req.body = { ...expense_category_info, ...req.body };
  } else {
    let isExist = await isValidRecord('latest_expense_category', {
      expense_category_name: req.body.expense_category_name,
    });

    if (isExist) throwError(404, 'expense_category is already exists.');
    req.body.expense_category_uuid = uuid();
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
      dynamic_approval_count_uuid: uuid(),
      table_name: 'latest_expense',
      dynamic_uuid: req.body.expense_category_uuid,
      dynamic_table_name: 'latest_expense_category',
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
      next_status: 'FINANCE',
      status: 'ACTIVE',
      created_by_uuid: req.body.created_by_uuid,
    };

    // let insert_dynamic_approval1 = await insertRecords('dynamic_approval_count', data1);

    const data2 = {
      dynamic_approval_count_uuid: uuid(),
      table_name: 'latest_expense',
      dynamic_uuid: req.body.expense_category_uuid,
      dynamic_table_name: 'latest_expense_category',
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
                column: 'reimbursed_amount',
                operator: 'GREATER_THAN_EQUAL',
                value: '10000',
              },
              {
                column: 'requested_advance_amount',
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
  let expense_category = await insertRecords('expense_category', req.body);

  saveHistory(
    {
      oldRecord: isExist,
      newRecord: req.body,
    },
    'expense_category',
    'expense_category_uuid',
    'Expense Category',
    expense_category.insertId,
    req.user,
  );

  res.json(responser('expense_category created  successfully.', req.body));
};

exports.getExpenseCategory = async (req, res) => {
  const {
    expense_category_uuid,
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

  let tableName = 'latest_expense_category';
  let filter = filterFunctionality(
    {
      expense_category_uuid,
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
    responser('All expense_category', result, result.length, totalRecords),
  );
};

exports.getAdvanceAmount = async (req, res) => {
  const { user_uuid } = req.query;

  const advance_amount = await dbRequest(`SELECT 
     user_uuid,
      GREATEST(
    COALESCE(
        SUM(
            CASE 
                WHEN status = 'FINANCE' AND expense_type = 'ADVANCE'  THEN IFNULL(requested_advance_amount, 0)
                ELSE 0
            END
            - IF(is_deduct_from_advance, IFNULL(reimbursed_amount, 0), 0)
        ), 
        0

        ),
        0
    ) AS advance_amount
FROM expense
WHERE user_uuid = '${user_uuid}'
GROUP BY user_uuid;`);
  if (!advance_amount.length) {
    res.json(
      responser('advance_amount', {
        user_uuid,
        advance_amount: '0',
      }),
    );
  } else {
    res.json(responser('advance_amount', advance_amount));
  }
};

exports.convertFinanceToCleared = async (req, res) => {
  let { expense_uuids } = req.body;
  // TODO:only finace manager allowed to call this api

  let allowedRole = ['FINANCE_MANAGER', 'ADMIN'];

  if (!allowedRole.includes(req.user.role_value)) {
    throwError(400, 'Only finace manager allowed to call this api');
  }

  if (!expense_uuids.length) {
    throwError(400, 'Expense uuids is required');
  }

  let expense = await getRecords(
    'latest_expense',
    `where expense_uuid in ('${expense_uuids.join("','")}') AND status = 'FINANCE'`,
  );

  if (!expense.length) {
    return res.json(responser('No expense found', expense));
  }
  expense = expense.map((item) => ({ ...item, status: 'CLEARED' }));
  await insertRecords('expense', expense);
  return res.json(responser('Expense converted to cleared', expense));
};

exports.exportFinanceExpense = async (req, res) => {
  const { expense_uuids, billing_company_uuid } = req.body;

  const expense = await getRecords(
    'latest_expense',
    `where expense_uuid in ('${expense_uuids.join("','")}')`,
  );

  const [company] = await getRecords(
    'latest_bank_details',
    `where customer_uuid='${billing_company_uuid}'`,
  );

  if (!company) return throwError(404, 'Company Bank Details not found.');

  const companyDetails = {
    bank_name: company.ifsc_code?.slice(0, 4).toUpperCase(),
    account: company.account_no,
    ifsc_code: company.ifsc_code,
  };

  const processExpense = async (item) => {
    const userTable =
      item.expense_type === 'JOB' ? 'latest_vendors' : 'latest_user';
    const userField = item.expense_type === 'JOB' ? 'vendor_uuid' : 'user_uuid';

    console.log(item, '...........................');
    const [user] = await getRecords(
      userTable,
      `where ${userField}='${item[userField]}'`,
    );
    if (!user) return throwError(404, `${item.expense_type} user not found.`);

    const userDetails = {
      bank_name: user.bank_ifsc_code?.slice(0, 4).toUpperCase(),
      ifsc_code: user.bank_ifsc_code,
      account_number: user.bank_account_number,
      full_name: user?.full_name || user?.vendor_name,
      address: [
        user.unit_or_suite,
        user.street_address,
        user.city,
        user.province_or_state,
        user.postal_code,
        user.country,
      ]
        .filter(Boolean)
        .join(', '),
    };

    const amountField =
      item.expense_type === 'ADVANCE'
        ? 'requested_advance_amount'
        : 'eligible_reimbursement_amount';
    const amount = item[amountField];

    return {
      selfBank:
        companyDetails.bank_name === userDetails.bank_name
          ? {
              'EXPESNE TYPE': item.expense_type,
              'ACCOUNT NUMBER': userDetails.account_number,
              'SERVICE OUTLET': companyDetails.account?.slice(0, 4),
              'CURRENCY CODE OF ACCOUNT NUMBER': 'INR',
              'PART TRAN TYPE': 'C',
              'TRANSACTION AMOUNT': amount,
              'TRANSACTION PARTICULAR': `Expense ${item.expense_date} ${userDetails.full_name}`,
              'REFERENCE NUMBER': '',
              'RATE CODE': '',
              'ACCOUNT REPORT CODE': '',
              'REFERENCE AMOUNT': '',
              'INSTRUMENT TYPE': '',
              'REFERENCE CURRENCY CODE': '',
              'VALUE DATE': '',
              'PARTICULARS 1': '',
            }
          : null,
      otherBank:
        companyDetails.bank_name !== userDetails.bank_name
          ? {
              'EXPESNE TYPE': item.expense_type,
              Amount: amount,
              'Debit Account': companyDetails.account,
              IFSC: userDetails.ifsc_code,
              'Beneficiary Account': userDetails.account_number,
              'Beneficiary name': userDetails.full_name,
              Address: userDetails.address || '',
              'Tran particular': `Expense ${item.expense_date}, ${userDetails.full_name}`,
            }
          : null,
    };
  };

  const processedData = await Promise.all(
    expense.map((item) => processExpense(item)),
  );

  const selfBankData = processedData
    .map((data) => data.selfBank)
    .filter(Boolean);

  // unshift fist value to self bank data
  if (selfBankData.length > 0) {
    selfBankData.unshift({
      'EXPESNE TYPE': null,
      'ACCOUNT NUMBER': companyDetails.account,
      'SERVICE OUTLET': companyDetails.account?.slice(0, 4),
      'CURRENCY CODE OF ACCOUNT NUMBER': 'INR',
      'PART TRAN TYPE': 'D',
      'TRANSACTION AMOUNT': selfBankData.reduce(
        (acc, item) => acc + item['TRANSACTION AMOUNT'],
        0,
      ),
      'TRANSACTION PARTICULAR': `Expense`,
      'REFERENCE NUMBER': '',
      'RATE CODE': '',
      'ACCOUNT REPORT CODE': '',
      'REFERENCE AMOUNT': '',
      'INSTRUMENT TYPE': '',
      'REFERENCE CURRENCY CODE': '',
      'VALUE DATE': '',
      'PARTICULARS 1': '',
    });
  }

  const otherBankData = processedData
    .map((data) => data.otherBank)
    .filter(Boolean);

  res
    .status(200)
    .json(responser('Exported successfully', { selfBankData, otherBankData }));
};

exports.getPreviewExpense = async (req, res) => {
  const { expense_uuid, isPreview } = req.query;

  const [expense] = await getRecords(
    'latest_expense',
    `where expense_uuid = '${expense_uuid}'`,
  );

  if (!expense) throwError(404, 'Expense not found.');

  // let templateFile = '';
  // console.log('expense', expense);
  // if (expense.expense_type === 'EXPENSE' || expense.expense_type === 'JOB') {
  //   templateFile = 'expense.ejs';
  // } else if (expense.expense_type === 'ADVANCE') {
  //   templateFile = 'advanceExpense.ejs';
  // } else if (expense.expense_type === 'JOB') {
  //   templateFile = 'job.ejs';
  // } else {
  //   return res.status(400).json(responser('Invalid expense type'));
  // }
  if (isPreview === 'true') {
    result = await ejsPreview(
      {
        status: expense.status.replace('_', ' ').toUpperCase(),
        expense_type: expense.expense_type,
        project_name: expense.project_name,
        reimbursed_amount: expense.reimbursed_amount,
        created_by_name: expense.created_by_name,
        user_name: expense.user_name,
        expense_category_name: expense.expense_category_name,
        expense_date: expense.expense_date,
        requested_advance_amount: expense.requested_advance_amount,
        job_order_no: expense.job_order_no,
        job_name: expense.job_name,
      },
      `pdf/expense.ejs`,
    );
    return res.json(responser('PO EJS', result));
  } else {
    result = await pdfMaker(
      {
        status: expense.status,
        expense_type: expense.expense_type,
        project_name: expense.project_name,
        reimbursed_amount: expense.reimbursed_amount,
        created_by_name: expense.created_by_name,
        user_name: expense.user_name,
        expense_category_name: expense.expense_category_name,
        expense_date: expense.expense_date,
        requested_advance_amount: expense.requested_advance_amount,
        job_order_no: expense.job_order_no,
        job_name: expense.job_name,
      },
      `expense.ejs`,
      {
        isTitlePage: false,
      },
    );
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="expense_invoice.pdf"',
    );
    res.send(Buffer.from(result));
  }
};

exports.getExpenseDynamicApprovalHistory = async (req, res) => {
  const {
    dynamic_approval_uuid,
    requested_by_uuid,
    expense_uuid,
    user_uuid,
    user_name,
    table_name,
    project_uuid,
    project_name,
    pageNo,
    itemPerPage,
    pageLimit,
    from_date,
    to_date,
    status,
    columns,
    value,
  } = req.query;

  // let tableName = 'dynamic_approval';
  let tableName = 'latest_dynamic_approval_history';

  let filter = filterFunctionality(
    {
      dynamic_approval_uuid,
      requested_by_uuid,
      expense_uuid,
      user_uuid,
      user_name,
      table_name,
      project_uuid,
      project_name,
    },
    status,
    to_date,
    from_date,
    Array.isArray(columns) ? columns : [columns],
    value,
  );

  let pageFilter = pagination(pageNo, itemPerPage, pageLimit);
  let totalRecords = await getCountRecord(tableName, filter);
  let result = await getRecords(tableName, filter, pageFilter);

  return res.json(
    responser(
      'All dynamic approval history',
      result,
      result.length,
      totalRecords,
    ),
  );
};
