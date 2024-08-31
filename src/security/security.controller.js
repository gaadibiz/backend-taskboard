const {
  pagination,
  insertRecords,
  filterFunctionality,
  getCountRecord,
  getRecords,
  dbRequest,
  isRecordExist,
  isValidRecord,
  roleFilterService,
  isEditAccess,
} = require('../../utils/dbFunctions');

const {
  responser,
  removeNullValueKey,
  throwError,
  getData,
  deleteKeyValuePair,
  setDateTimeFormat,
} = require('../../utils/helperFunction');

const { v4 } = require('uuid');
const uuid = v4;
const { base_url } = require('../../config/server.config');

exports.upsertRoles = async (req, res) => {
  await isEditAccess('role_module', req.user);
  removeNullValueKey(req.body);
  let isUpadtion = false;
  req.body.role_value = req.body.role_name
    .toUpperCase()
    .trim()
    .replace(/\s+/g, '_');
  if (req.body.role_uuid) {
    isUpadtion = true;
    let role_info = await getRecords(
      'latest_roles',
      `where role_uuid='${req.body.role_uuid}'`,
    );
    if (!role_info.length) throwError(404, 'Role not found.');
    role_info = role_info[0];
    deleteKeyValuePair(req.body, ['role_name']);
    req.body.modified_by_uuid = req.body.created_by_uuid;
    req.body.created_by_uuid = role_info.created_by_uuid;
    req.body = { ...role_info, ...req.body };
  } else {
    let isExist = await isRecordExist(
      'latest_roles',
      ['role_name'],
      [req.body.role_name],
    );
    if (isExist) throwError(406, 'Role already exist.');
    req.body.role_uuid = uuid();
  }
  const insertRole = await insertRecords('roles', req.body);
  res.json(responser('Roles created successfully.', req.body));

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
        historyMessage = `${userInfo?.first_name} has made an update in Role: ${req.body.role_name}`;
      } else {
        historyMessage = `${userInfo?.first_name} has created a Role: ${req.body.role_name}`;
      }
      const moduleId = insertRole.insertId;
      const bodyData = {
        module_name: 'Roles',
        module_uuid: req.body.role_uuid,
        module_id: moduleId,
        message: historyMessage,
        module_column_name: 'role_uuid',
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

exports.getRoles = async (req, res) => {
  const {
    role_id,
    role_uuid,
    pageNo,
    itemPerPage,
    from_date,
    to_date,
    status,
    columns,
    value,
  } = req.query;

  let tableName = 'latest_roles';
  let filter = filterFunctionality(
    {
      role_id,
      role_uuid,
    },
    status,
    to_date,
    from_date,
    Array.isArray(columns) ? columns : [columns],
    value,
  );
  filter = await roleFilterService(filter, 'role_module', req.user);
  console.log('filter', filter);

  if (filter) {
    filter = filter + " AND role_value <> 'SUPERADMIN'";
  } else {
    filter = filter + " WHERE role_value <> 'SUPERADMIN'";
  }

  let pageFilter = pagination(pageNo, itemPerPage);
  let totalRecords = await getCountRecord(tableName, filter);
  let result = await getRecords(tableName, filter, pageFilter, null, {
    isPrmiaryId: true,
  });
  return res.json(responser('Role ', result, result.length, totalRecords));
};

exports.upsertRoleModuleContentAccessPermission = async (req, res) => {
  await isEditAccess('role_module', req.user);
  removeNullValueKey(req.body);
  req.body = req.body.map((record) => {
    if (!record.role_module_uuid)
      return {
        ...record,
        role_module_uuid: v4(),
        create_ts: setDateTimeFormat('timestemp'),
      };
    else return record;
  });
  console.log(req.body);
  await insertRecords('role_module', req.body);
  console.log(req.body);
  return res.json(responser('Role module has been Updated.', req.body));
};

exports.getRoleModuleContentAccessPermission = async (req, res) => {
  if (
    process.env.ROLE_FILTER &&
    process.env.ROLE_FILTER === 'true' &&
    req.user
  ) {
    let selfUser = req.user;
    let roleFiletrData = (
      await dbRequest(
        `call role_content_access('${selfUser.role_uuid}',"role_module")`,
      )
    )[0];
    if (!roleFiletrData.length)
      throwError(403, 'No module access for this Role!');
    if (!roleFiletrData[0].view_access || roleFiletrData[0].status !== 'ACTIVE')
      throwError(403, 'You have no access to Edit this module!');
  }
  const { role_uuid } = req.query;
  if (!role_uuid) {
    let result = await dbRequest(`select 
    *, 
    "" as role_name,
    "" as role_uuid,
    0 as view_access,
    0 as edit_access,
    0 as bulk_import,
    0 as  send_sms,
    0 as  send_mail,
    0 as  send_whatsapp,
    0 as  send_call,
    0 as show_module,
    JSON_OBJECT() as filter_values
    from module where status="ACTIVE"`);
    deleteKeyValuePair(result, [
      'module_id',
      'table_name',
      'created_by_uuid',
      'create_ts',
      'status',
    ]);
    return res.json(responser('Module List', result));
  } else {
    let result = await dbRequest(
      `call role_content_access('${role_uuid}',NULL)`,
    );
    console.log(result);
    let role = (
      await getRecords('latest_roles', `where role_uuid='${role_uuid}'`)
    )[0];
    res.json(
      responser('Record Access Permission', {
        role_name: role.role_name,
        role_group: role.role_group,
        data: result[0],
      }),
    );
  }
};

exports.getModules = async (req, res) => {
  let modules = await getRecords('module');
  return res.json(responser('Modules', modules));
};
