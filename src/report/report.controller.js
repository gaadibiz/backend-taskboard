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

exports.upsertExpense = async (req, res) => {
  // isEditAccess('latest_leads_with_expense', req.user);
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
    report_uuid,
    unreported,
    project_uuid,
    expense_category_uuid,
    pageNo,
    itemPerPage,
    from_date,
    to_date,
    status,
    columns,
    value,
  } = req.query;

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

  // filter to handle unreported list
  if (unreported === 'UNREPORTED') {
    if (filter) {
      filter += ` AND ( ${report_uuid ? `report_uuid = '${report_uuid}' OR ` : ''} report_uuid IS NULL)`;
    } else {
      filter += `WHERE ${report_uuid ? `report_uuid = '${report_uuid}' OR ` : ''}  report_uuid IS NULL`;
    }
  } else {
    if (filter) {
      filter += `${report_uuid ? `AND report_uuid = '${report_uuid}'` : ''}`;
    } else {
      filter += `${report_uuid ? `WHERE report_uuid = '${report_uuid}'` : ''}`;
    }
  }

  console.log(filter);
  filter = await roleFilterService(filter, 'latest_expense', req.user);
  let pageFilter = pagination(pageNo, itemPerPage);
  let totalRecords = await getCountRecord(tableName, filter);
  let result = await getRecords(tableName, filter, pageFilter);

  return res.json(responser('expense: ', result, result.length, totalRecords));
};

exports.upsertReport = async (req, res) => {
  // isEditAccess('latest_leads_with_project', req.user);
  const { expense_uuid_list } = req.body;

  removeNullValueKey(req.body);
  let isUpadtion = false;
  if (req.body.report_uuid) {
    isUpadtion = true;
    let project_info = await getRecords(
      'latest_report',
      `where report_uuid='${req.body.report_uuid}'`,
    );
    if (!project_info.length) throwError(404, 'project not found.');
    project_info = project_info[0];
    req.body.modified_by_uuid = req.body.created_by_uuid;
    req.body.created_by_uuid = project_info.created_by_uuid;
    req.body = { ...project_info, ...req.body };
    console.log('req.body in update: ', req.body);
  } else {
    req.body.create_ts = setDateTimeFormat('timestemp');
    req.body.report_uuid = uuid();
  }
  const insertProject = await insertRecords('report', req.body);

  if (expense_uuid_list?.length) {
    let expense_data = await getRecords(
      'latest_expense',
      `where expense_uuid IN (${expense_uuid_list.map((item) => `'${item}'`).join(',')})`,
    );

    if (!expense_data.length) throwError(404, 'expense not found');
    expense_data = expense_data.map((item) => {
      return {
        ...item,
        report_uuid: req.body.report_uuid,
        report_name: req.body.report_name,
      };
    });

    const insertexpense = await insertRecords('expense', expense_data);
  }

  //<------------ handle costing sheet approval modal properly ----------->
  const bodyData = {
    table_name: 'latest_report',
    record_uuid: req.body.report_uuid,
    record_column_name: 'report_uuid',
  };
  await getData(
    base_url + '/api/v1/approval/insert-approval',
    null,
    'json',
    bodyData,
    'POST',
    req.headers,
  );

  res.json(responser('Report created or updated successfully.', req.body));
  // res.json(responser('Project created or updated successfully.', req.body));

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
        historyMessage = `${userInfo?.first_name} has made an update in Report.`;
      } else {
        historyMessage = `${userInfo?.first_name} has created a department.`;
      }
      const moduleId = insertProject.insertId;
      const bodyData = {
        module_name: 'Report',
        module_uuid: req.body.project_uuid,
        module_id: moduleId,
        message: historyMessage,
        module_column_name: 'report_uuid',
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

exports.getReport = async (req, res) => {
  const {
    project_uuid,
    report_uuid,
    project_manager_uuid,
    department_uuid,
    pageNo,
    itemPerPage,
    from_date,
    to_date,
    status,
    columns,
    value,
  } = req.query;

  let tableName = 'latest_report';
  let filter = filterFunctionality(
    {
      project_uuid,
      report_uuid,
      project_manager_uuid,
      department_uuid,
    },
    status,
    to_date,
    from_date,
    Array.isArray(columns) ? columns : [columns],
    value,
  );
  // need suggestion
  // filter = await roleFilterService(filter, 'latest_report', req.user);
  let pageFilter = pagination(pageNo, itemPerPage);
  let totalRecords = await getCountRecord(tableName, filter);
  let result = await getRecords(tableName, filter, pageFilter);

  // to add new unreported expense
  result.forEach((item) => {
    item.expense_uuid_list = [];
  });

  if (report_uuid) {
    // merge approval record logic
    result[0] = await getData(
      base_url + '/api/v1/approval/merge-approval-record',
      null,
      'json',
      {
        record_uuid: report_uuid,
        table_name: 'latest_report',
        data: result[0],
      },
      'POST',
      req.headers,
    );
  }

  return res.json(
    responser('department: ', result, result.length, totalRecords),
  );
};

exports.upsertExpenseCategory = async (req, res) => {
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
