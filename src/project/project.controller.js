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

exports.upsertProject = async (req, res) => {
  isEditAccess('latest_project_with_team', req.user);
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
    req.body.modified_by_uuid = req.body.created_by_uuid;
    req.body.created_by_uuid = project_info.created_by_uuid;
    req.body = { ...project_info, ...req.body };
    console.log('req.body in update: ', req.body);
  } else {
    req.body.create_ts = setDateTimeFormat('timestemp');
    req.body.project_uuid = uuid();
  }
  const insertProject = await insertRecords('project', req.body);
  res.json(responser('Project created or updated successfully.', req.body));

  //<------------ handle project approval module properly ----------->
  const bodyData = {
    table_name: 'latest_project',
    record_uuid: req.body.project_uuid,
    record_column_name: 'project_uuid',
  };
  getData(
    base_url + '/api/v1/approval/insert-approval',
    null,
    'json',
    bodyData,
    'POST',
    req.headers,
  );
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

  let tableName = 'latest_project';
  let filter = filterFunctionality(
    {
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

  filter = await roleFilterService(filter, tableName, req.user);
  let pageFilter = pagination(pageNo, itemPerPage);
  let totalRecords = await getCountRecord(tableName, filter);
  let result = await getRecords(tableName, filter, pageFilter);

  return res.json(responser('Project: ', result, result.length, totalRecords));
};

exports.upsertProjectTeam = async (req, res) => {
  // isEditAccess('latest_leads_with_project', req.user);
  removeNullValueKey(req.body);
  let isUpadtion = false;
  if (req.body.project_team_uuid) {
    isUpadtion = true;

    let project_info = await getRecords(
      'latest_project_team',
      `where project_team_uuid='${req.body.project_team_uuid}'`,
    );
    if (!project_info.length) throwError(404, 'project not found.');
    project_info = project_info[0];
    req.body.modified_by_uuid = req.body.created_by_uuid;
    req.body.created_by_uuid = project_info.created_by_uuid;
    req.body = { ...project_info, ...req.body };
    console.log('req.body in update: ', req.body);
  } else {
    project_info = await getRecords(
      'latest_project_team',
      `where project_uuid='${req.body.project_uuid}' and user_uuid='${req.body.user_uuid}'`,
    );
    if (project_info.length)
      throwError(404, 'User already exists in project team.');

    req.body.create_ts = setDateTimeFormat('timestemp');
    req.body.project_team_uuid = uuid();
  }
  const insertProject = await insertRecords('project_team', req.body);

  res.json(
    responser('Project team created or updated successfully.', req.body),
  );

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
        historyMessage = `${userInfo?.first_name} has made an update in project team.`;
      } else {
        historyMessage = `${userInfo?.first_name} has created a project team.`;
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

exports.getProjectTeam = async (req, res) => {
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

  let tableName = 'latest_project_team';
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
  // need suggestion
  // filter = await roleFilterService(filter, 'latest_project_team', req.user);
  let pageFilter = pagination(pageNo, itemPerPage);
  let totalRecords = await getCountRecord(tableName, filter);
  let result = await getRecords(tableName, filter, pageFilter);

  return res.json(
    responser('Project team: ', result, result.length, totalRecords),
  );
};
