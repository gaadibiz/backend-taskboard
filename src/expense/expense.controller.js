const { v4: uuid } = require('uuid');
const {
  pagination,
  filterFunctionality,
  getCountRecord,
  getRecords,
  insertRecords,
  isValidRecord,
  roleFilterService,
  isEditAccess,
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

function toBoolean(value) {
  if (value === 'true' || value === true || value === 1) return true;
  if (value === 'false' || value === false || value === 0) return false;
  return Boolean(value); // Fallback for other truthy/falsy values
}

exports.upsertExpense = async (req, res) => {
  isEditAccess('latest_expense', req.user);
  removeNullValueKey(req.body);
  let isUpadtion = false;
  if (req.body.expense_uuid) {
    isUpadtion = true;
    let expense_info = await getRecords(
      'latest_expense',
      `where expense_uuid='${req.body.expense_uuid}'`,
    );
    if (!expense_info.length) throwError(404, 'expense_info not found.');
    expense_info = expense_info[0];
    req.body.modified_by_uuid = req.body.created_by_uuid;
    req.body.created_by_uuid = expense_info.created_by_uuid;
    req.body = { ...expense_info, ...req.body };
    console.log('req.body in update: ', req.body);
  } else {
    req.body.create_ts = setDateTimeFormat('timestemp');
    req.body.expense_uuid = uuid();
  }
  const insertexpense = await insertRecords('expense', req.body);

  //<------------ handle costing sheet approval modal properly ----------->
  const bodyData = {
    table_name: 'latest_expense',
    dynamic_uuid: req.body.expense_category_uuid,
    record_uuid: req.body.expense_uuid,
    record_column_name: 'expense_uuid',
  };
  await getData(
    base_url + '/api/v1/dynamicApproval/insert-approval',
    null,
    'json',
    bodyData,
    'POST',
    req.headers,
  );

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
    pageNo,
    itemPerPage,
    from_date,
    to_date,
    status,
    columns,
    value,
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
    },
    status,
    to_date,
    from_date,
    Array.isArray(columns) ? columns : [columns],
    value,
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

  filter = await roleFilterService(filter, 'latest_expense', req.user);
  let pageFilter = pagination(pageNo, itemPerPage);
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
      const { approval_uuid, requested_by_uuid, is_user_approver } =
        mergeExpense; // Destructure for direct assignments
      Object.assign(result[0], {
        approval_uuid,
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
  if (req.body.expense_category_uuid) {
    let isExist = await isValidRecord('latest_expense_category', {
      expense_category_uuid: req.body.expense_category_uuid,
    });
    if (!isExist) throwError(404, 'expense_category not found.');
    isUpadtion = true;
  } else {
    let isExist = await isValidRecord('latest_expense_category', {
      expense_category_name: req.body.expense_category_name,
    });

    console.log(isExist);

    if (isExist) throwError(404, 'expense_category is already exists.');
    req.body.expense_category_uuid = uuid();
  }
  let expense_category = await insertRecords('expense_category', req.body);
  res.json(responser('expense_category created  successfully.', req.body));
};

exports.getExpenseCategory = async (req, res) => {
  const {
    expense_category_uuid,
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
