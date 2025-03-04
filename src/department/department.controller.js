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

exports.upsertDepartment = async (req, res) => {
  // isEditAccess('latest_leads_with_department', req.user);
  removeNullValueKey(req.body);
  let isUpadtion = false;
  if (req.body.department_uuid) {
    isUpadtion = true;
    let department_info = await getRecords(
      'latest_department',
      `where department_uuid='${req.body.department_uuid}'`,
    );
    if (!department_info.length) throwError(404, 'department_info not found.');
    department_info = department_info[0];
    req.body.modified_by_uuid = req.body.created_by_uuid;
    req.body.created_by_uuid = department_info.created_by_uuid;
    req.body = { ...department_info, ...req.body };
    console.log('req.body in update: ', req.body);
  } else {
    req.body.create_ts = setDateTimeFormat('timestemp');
    req.body.department_uuid = uuid();
  }
  const insertdepartment = await insertRecords('department', req.body);
  res.json(responser('department created or updated successfully.', req.body));

  // res.json(responser('department created or updated successfully.', req.body));

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
        historyMessage = `${userInfo?.first_name} has made an update in department.`;
      } else {
        historyMessage = `${userInfo?.first_name} has created a department.`;
      }
      const moduleId = insertdepartment.insertId;
      const bodyData = {
        module_name: 'Department',
        module_uuid: req.body.department_uuid,
        module_id: moduleId,
        message: historyMessage,
        module_column_name: 'department_uuid',
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

exports.getDepartment = async (req, res) => {
  const {
    department_uuid,
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

  let tableName = 'latest_department';
  let filter = filterFunctionality(
    {
      department_uuid,
      billing_company_uuid,
      billing_company_branch_uuid,
    },
    status,
    to_date,
    from_date,
    Array.isArray(columns) ? columns : [columns],
    value,
  );
  filter = await roleFilterService(filter, 'latest_department', req.user);
  let pageFilter = pagination(pageNo, itemPerPage);
  let totalRecords = await getCountRecord(tableName, filter);
  let result = await getRecords(tableName, filter, pageFilter);

  return res.json(
    responser('department: ', result, result.length, totalRecords),
  );
};
