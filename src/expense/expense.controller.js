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
const e = require('cors');
const { z } = require('zod');
const { insertExpenseLedger } = require('./expense.service');

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

  console.log(req.body, '................................................body');

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
    expense_type,
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
      expense_type,
    },
    status,
    to_date,
    from_date,
    Array.isArray(columns) ? columns : [columns],
    value,
    advanceFilter,
  );

  // if (toBoolean(is_type_expense)) {
  //   condition += (condition ? ' OR ' : '') + "expense_type = 'EXPENSE'";
  // }
  // if (toBoolean(is_type_advance)) {
  //   condition += (condition ? ' OR ' : '') + "expense_type = 'ADVANCE'";
  // }
  // if (toBoolean(is_type_job)) {
  //   condition += (condition ? ' OR ' : '') + "expense_type = 'JOB'";
  // }

  // self draft filter
  filter +=
    (filter ? ' AND ' : ' WHERE ') +
    `(
  status != 'EXPENSE_REQUESTED' OR (
   status = 'EXPENSE_REQUESTED' AND (
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

  // get expense status count
  const expenseStatus = await dbRequest(`SELECT status, COUNT(*) AS count
  FROM ${tableName} 
  ${filter}
  GROUP BY status;`);
  console.log('expenseStatus', expenseStatus);
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
      next_status: 'FINANCE_APPROVED',
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
              {
                column: 'vendor_advance_amount',
                operator: 'GREATER_THAN_EQUAL',
                value: '10000',
                logicalOperator: 'OR',
              },
              {
                column: 'net_vendor_payable_amount',
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
  const { user_uuid, billing_company_uuid, project_uuid } = req.query;

  const sql = `SELECT user_uuid, sum(advance_amount) as advance_amount, sum(pending_amount) as pending_amount FROM latest_user_advance where user_uuid = '${user_uuid}' and billing_company_uuid = '${billing_company_uuid}' ${project_uuid ? `and project_uuid = '${project_uuid}'` : ''} GROUP BY user_uuid;`;

  const [advance_amount] = await dbRequest(sql);

  console.log(
    advance_amount,
    '...............................................',
  );

  if (!advance_amount) {
    res.json(
      responser('advance_amount', {
        user_uuid,
        advance_amount: 0,
        pending_amount: 0,
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
    `where expense_uuid in ('${expense_uuids.join("','")}') AND status = 'FINANCE_APPROVED'`,
  );

  if (!expense.length) {
    return res.json(responser('No expense found', expense));
  }
  expense = expense.map((item) => {
    if (item.expense_type === 'EXPENSE') {
      // ledger entry debit
      if (item.is_deduct_from_advance) {
        insertExpenseLedger(
          parseFloat(item.actual_reimbursed_amount),
          0,
          item.expense_uuid,
        );
      }
    } else if (
      item.expense_type === 'VENDOR_PAYMENT' &&
      item.payment_type === 'PAYMENT'
    ) {
      insertExpenseLedger(
        parseFloat(item.vendor_payable_amount),
        0,
        item.expense_uuid,
      );

      // ledger entry debit
    } else if (
      item.expense_type === 'VENDOR_PAYMENT' &&
      item.payment_type === 'ADVANCE'
    ) {
      insertExpenseLedger(
        0,
        parseFloat(item.vendor_advance_amount),
        item.expense_uuid,
      );

      // ledger entry cradit
    } else if (item.expense_type === 'ADVANCE') {
      insertExpenseLedger(
        0,
        parseFloat(item.actual_requested_advance_amount),
        item.expense_uuid,
      );
      // ledger entry cradit
    }

    return { ...item, status: 'CLEARED' };
  });

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

  const workflowRes = await getData(
    `${base_url}/api/v1/expense/get-expense-approval-workflow`,
    { expense_uuid },
    'json',
    null,
    'GET',
    req.headers,
  );

  const workflowData = workflowRes?.data?.workflow || {};
  const workflow = {
    EXPENSE_APPROVAL_REQUESTED: workflowData.EXPENSE_APPROVAL_REQUESTED || [],
    FINANCE_APPROVAL_REQUESTED: workflowData.FINANCE_APPROVAL_REQUESTED || [],
  };

  let extraData = {};
  let template = '';

  if (expense.expense_type === 'VENDOR_PAYMENT') {
    const [vendor] = await getRecords(
      'latest_vendors',
      `where vendor_uuid = '${expense.vendor_uuid}'`,
    );
    extraData.vendor = vendor || {};

    template =
      expense.payment_type === 'ADVANCE'
        ? 'vendorExpenseAd.ejs'
        : 'vendorExpense.ejs';
  } else {
    const [user_details] = await getRecords(
      'latest_user',
      `where user_uuid = '${expense.user_uuid}'`,
    );
    extraData.user_details = user_details || {};

    template =
      expense.expense_type === 'ADVANCE'
        ? 'advanceExpense.ejs'
        : 'expenseExpense.ejs';
  }

  const data = {
    data: {
      ...expense,
      ...extraData,
      workflow,
    },
  };
  console.log('data------------>', data);

  if (isPreview === 'true') {
    const result = await ejsPreview(data, `pdf/${template}`);
    return res.json(responser('PO EJS', result));
  }

  const pdfBuffer = await pdfMaker(data, template, { isTitlePage: false });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    'attachment; filename="expense_invoice.pdf"',
  );
  res.send(Buffer.from(pdfBuffer));
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

exports.getExpenseApprovalWorkFlow = async (req, res) => {
  const { expense_uuid } = req.query;

  const [expense] = await getRecords(
    'latest_expense',
    `where expense_uuid = '${expense_uuid}'`,
  );

  if (!expense) throwError(404, 'Expense not found.');

  const approvalCount = await getRecords(
    'latest_dynamic_approval_count',
    `where dynamic_uuid = '${expense.expense_category_uuid}'`,
  );

  const EXPENSE_APPROVAL_REQUESTED = approvalCount.find(
    (item) => item.approval_raise_status === 'EXPENSE_APPROVAL_REQUESTED',
  );

  const FINANCE_APPROVAL_REQUESTED = approvalCount.find(
    (item) => item.approval_raise_status === 'FINANCE_APPROVAL_REQUESTED',
  );

  const expense_Hierarchy = await buildHierarchy(
    EXPENSE_APPROVAL_REQUESTED,
    expense,
    'EXPENSE_APPROVAL_REQUESTED',
    'latest_expense',
    expense_uuid,
    ['FINANCE_APPROVAL_REQUESTED', 'FINANCE_APPROVED', 'CLEARED'],
  );

  const finance_Hierarchy = await buildHierarchy(
    FINANCE_APPROVAL_REQUESTED,
    expense,
    'FINANCE_APPROVAL_REQUESTED',
    'latest_expense',
    expense_uuid,
    ['FINANCE_APPROVED', 'CLEARED'],
  );

  const workflow = {
    EXPENSE_REQUESTED: [
      {
        current_pointer: expense.status === 'EXPENSE_REQUESTED' ? true : false,
        is_completed:
          expense.status !== 'EXPENSE_REQUESTED' &&
          [
            'EXPENSE_APPROVAL_REQUESTED',
            'FINANCE_APPROVAL_REQUESTED',
            'FINANCE_APPROVED',
            'CLEARED',
          ].includes(expense.status)
            ? true
            : false,
      },
    ],
    EXPENSE_APPROVAL_REQUESTED: [...expense_Hierarchy],
    FINANCE_APPROVAL_REQUESTED: [...finance_Hierarchy],
    FINANCE_APPROVED: [
      {
        current_pointer: expense.status === 'FINANCE_APPROVED',
        is_completed:
          expense.status !== 'FINANCE_APPROVED' &&
          ['CLEARED'].includes(expense.status)
            ? true
            : false,
      },
    ],
    CLEARED: [
      {
        current_pointer: expense.status === 'CLEARED',
        is_completed: expense.status === 'CLEARED',
      },
    ],
  };

  // console.log(workflow, '................workflow');

  return res.json(
    responser('Expense approval workflow', {
      workflow,
    }),
  );
};

const buildHierarchy = async (
  approvalData,
  expense,
  currentStatus,
  tableName,
  record_uuid,
  comingStatus,
) => {
  const hierarchy = [];
  let approval_level = 0;

  for (const items of approvalData?.approval_hierarchy || []) {
    approval_level++;
    for (const item of items) {
      let user_name = '';
      let user_uuid = '';
      let role_name = '';
      let role_uuid = '';

      if (item.type === 'ROLE') {
        const [role] = await getRecords(
          'latest_roles',
          `where role_uuid = '${item.uuid}'`,
        );
        if (!role) continue;

        const role_value = role.role_value;
        role_name = role_value;
        role_uuid = item.uuid;

        switch (role_value) {
          case 'PROJECT_MANAGER':
            user_name = expense.project_manager_name;
            user_uuid = expense.project_manager_uuid;
            break;
          case 'CATEGORY_MANAGER':
            user_name = expense.category_manager_name;
            user_uuid = expense.category_manager_uuid;
            break;
          case 'FINANCE_MANAGER':
            user_name = expense.finance_manager_name;
            user_uuid = expense.finance_manager_uuid;
            break;
          default:
            user_name = role.role_value;
            user_uuid = role.role_uuid;
        }
      } else {
        const [user] = await getRecords(
          'latest_user',
          `where user_uuid = '${item.uuid}'`,
        );
        if (!user) continue;

        user_name = user.user_name;
        user_uuid = user.user_uuid;
      }

      let approval = await getRecords(
        'dynamic_approval',
        `where dynamic_uuid = '${expense.expense_category_uuid}' 
          AND current_level = ${approval_level}
          AND table_name = '${tableName}'
          AND previous_status = '${approvalData.previous_status}'
          AND next_status = '${approvalData.next_status}'
          AND record_uuid = '${record_uuid}'
          AND status in ('APPROVED', 'REJECTED', 'REQUESTED')
          AND JSON_CONTAINS(approval_uuids, JSON_OBJECT('type', '${item.type}', 'uuid', '${item.uuid}'))`,
      );

      const priority = ['APPROVED', 'REQUESTED', 'REJECTED'];

      const selectedApproval =
        priority
          .map((status) => approval.find((item) => item.status === status))
          .find(Boolean) || null;

      let approver = null;

      if (selectedApproval?.status === 'APPROVED') {
        [approver] = await getRecords(
          'latest_user',
          `where user_uuid = '${selectedApproval.created_by_uuid}'`,
        );
      }

      hierarchy.push({
        role: role_name,
        role_uuid: role_uuid,
        user_name,
        user_uuid,
        next_status: approvalData.next_status,
        previous_status: approvalData.previous_status,
        current_status: approvalData.approval_raise_status,
        level: approval_level,
        approved_by_uuid: approver ? approver.user_uuid : null,
        approved_by_name: approver
          ? `${approver.first_name}${approver.last_name ? ' ' + approver.last_name : ''}`
          : null,
        remark: selectedApproval?.remark,
        approval_status: selectedApproval?.status || null,
        current_pointer:
          expense.status === currentStatus &&
          selectedApproval?.status === 'REQUESTED',
        is_completed:
          selectedApproval?.status === 'APPROVED' ||
          comingStatus.includes(expense.status),
      });
    }
  }

  return hierarchy;
};
