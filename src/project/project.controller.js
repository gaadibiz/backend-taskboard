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
const g = require('axios-request');

exports.upsertProject = async (req, res) => {
  // isEditAccess('latest_leads_with_project', req.user);
  removeNullValueKey(req.body);
  let isUpadtion = false;
  if (req.body.project_uuid) {
    isUpadtion = true;
    let project_info = await getRecords(
      'latest_project',
      `where project_uuid='${req.body.project_uuid}'`,
    );
    if (!project_info.length) throwError(404, 'project_info not found.');
    project_info = project_info[0];
    project_info.create_ts = setDateTimeFormat(
      'timestemp',
      project_info.create_ts,
    );
    req.body = { ...project_info, ...req.body };
  } else {
    req.body.create_ts = setDateTimeFormat('timestemp');
    req.body.project_uuid = uuid();
  }
  const insertProject = await insertRecords('project', req.body);
  res.json(responser('Project created or updated successfully.', req.body));

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
        historyMessage = `${userInfo?.first_name} has made an update in project.`;
      } else {
        historyMessage = `${userInfo?.first_name} has created a project.`;
      }
      const moduleId = insertProject.insertId;
      const bodyData = {
        module_name: 'project',
        module_uuid: req.body.project_uuid,
        module_id: moduleId,
        message: historyMessage,
        module_column_name: 'project_uuid',
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

exports.getProject = async (req, res) => {
  const {
    project_uuid,
    pageNo,
    itemPerPage,
    from_date,
    to_date,
    status,
    columns,
    value,
  } = req.query;

  let tableName = 'latest_project';
  let filter = filterFunctionality(
    {
      project_uuid,
    },
    status,
    to_date,
    from_date,
    Array.isArray(columns) ? columns : [columns],
    value,
  );
  filter = await roleFilterService(
    filter,
    'latest_leads_with_project',
    req.user,
  );
  let pageFilter = pagination(pageNo, itemPerPage);
  let totalRecords = await getCountRecord(tableName, filter);
  let result = await getRecords(tableName, filter, pageFilter);

  return res.json(responser('Project: ', result, result.length, totalRecords));
};
