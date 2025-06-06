const {
  insertRecords,
  getRecords,
  getTableColumnsNames,
  isValidRecord,
  filterFunctionality,
  pagination,
  dbRequest,
  roleFilterService,
  insertRecordHandleIncremental,
  isTableOrViewExist,
  getCountRecord,
  isColumnExistInTable,
  advanceFiltering,
} = require('../../utils/dbFunctions');
const {
  removeNullValueKey,
  throwError,
  responser,
  getData,
  setDateTimeFormat,
  deleteKeyValuePair,

  conditionApproval,
  is_true,
} = require('../../utils/helperFunction');
const { v4: uuidv4 } = require('uuid');
const { base_url } = require('../../config/server.config');
const tableMap = require('./tablemapping.json');
const {
  approvalEmails,
  saveHistory,
} = require('../../utils/microservice_func');
const { creatorOwnsCurrentApprovalStep } = require('./dynamicApproval.service');

exports.insertApproval = async (req, res) => {
  removeNullValueKey(req.body);
  let columns = await getTableColumnsNames(
    tableMap[req.body.table_name] || req.body.table_name,
  );

  if (!columns.includes(req.body.record_column_name))
    throwError(
      400,
      `Table does not have ${req.body.record_column_name} column`,
    );
  let approvalRecordInfo = (
    await getRecords(
      tableMap[req.body.table_name] || req.body.table_name,
      `where ${req.body.record_column_name}='${req.body.record_uuid}'`,
    )
  )[0];
  console.log('approval RecordInfo', approvalRecordInfo);
  if (!approvalRecordInfo)
    throwError(404, 'ApprovalRecordInfo not found and access cannot be given.');

  const approvalCount = (
    await getRecords(
      'latest_dynamic_approval_count',
      `where table_name="${req.body.table_name}" AND dynamic_uuid = "${req.body.dynamic_uuid}"  AND approval_raise_status="${approvalRecordInfo.status}"
      and status="ACTIVE"`,
    )
  )[0];
  console.log('approvalCount', approvalCount);

  if (!approvalCount) {
    return res.status(200).json(responser(`No approval for current status : `));
  }

  // handle special approval

  let special_approval_uuids = Array.isArray(
    approvalRecordInfo.special_approval_uuids,
  )
    ? approvalRecordInfo.special_approval_uuids
    : [];

  approvalCount?.approval_hierarchy[0]?.map((item) => {
    // dont push if uuid already present in array
    if (item.type === 'USER' && !special_approval_uuids.includes(item.uuid)) {
      special_approval_uuids.push(item.uuid);
    }
  });

  if (special_approval_uuids.length) {
    await insertRecords(
      (tableMap[req.body.table_name] || req.body.table_name).replace(
        'latest_',
        '',
      ),
      {
        ...approvalRecordInfo,
        special_approval_uuids: special_approval_uuids,
      },
    );
  }

  let record = await getRecords(
    (tableMap[req.body.table_name] || req.body.table_name).replace(
      'latest_',
      '',
    ),
    `where ${req.body.record_column_name}='${req.body.record_uuid}'`,
  );
  console.log('record------------', record);
  if (!record.length) {
    return throwError(400, 'Record not found');
  }

  let implemented_approval_hierarchy = conditionApproval(
    approvalCount,
    0, // level
    record[0],
  );

  console.log(implemented_approval_hierarchy, '..................visi');

  const query = `
  table_name='${req.body.table_name}'
  AND record_uuid='${req.body.record_uuid}'
  AND current_level=${implemented_approval_hierarchy[0].condition.level}
  AND previous_status='${approvalCount.previous_status}' 
  AND next_status='${approvalCount.next_status}'
`;

  let [exist_approval] = await getRecords(
    'latest_dynamic_approval',
    `where ${query} AND status='REQUESTED'`,
  );

  if (exist_approval) {
    return res
      .status(200)
      .json(responser('Approval Already Raised successfully', req.body));
  } else {
    let [exist_approval] = await getRecords(
      'latest_dynamic_approval',
      `where  table_name='${req.body.table_name}'
  AND record_uuid='${req.body.record_uuid}' AND (status='ROLLBACK' OR status='APPROVED')`,
    );
    console.log('body', exist_approval);
    req.body = {
      ...(exist_approval ? exist_approval : {}),
      ...req.body,
      dynamic_approval_uuid: exist_approval?.dynamic_approval_uuid
        ? exist_approval?.dynamic_approval_uuid
        : uuidv4(),
      requested_by_uuid: req.user.user_uuid,
      current_level: implemented_approval_hierarchy[0].condition.level,
      approval_uuids: implemented_approval_hierarchy[0].approval,
      previous_status: approvalCount.previous_status,
      status: 'REQUESTED',
      next_status: approvalCount.next_status,
      create_ts: setDateTimeFormat('timestemp'),
    };

    console.log('body-----------------', req.body);

    await insertRecords('dynamic_approval', req.body);

    const isCreatorOwnsCurrentApprovalStep =
      await creatorOwnsCurrentApprovalStep(
        implemented_approval_hierarchy,
        record[0],
      );
    if (isCreatorOwnsCurrentApprovalStep) {
      // handle self approval
      const bodyData = {
        dynamic_approval_uuid: req.body.dynamic_approval_uuid,
        status: 'APPROVED',
      };

      await getData(
        `${base_url}/api/v1/dynamicApproval/handle-approval`,
        null,
        'json',
        bodyData,
        'POST',
        req.headers,
      );
    }

    res.status(200).json(responser('Approval inserted successfully', req.body));
    // <------------ Send Email On Action ------------->
    // approvalEmails(req.body.dynamic_approval_uuid, req.user);
  }
};

exports.handleApproval = async (req, res) => {
  removeNullValueKey(req.body);
  let recordStatus = '';
  let approved_flag = 'NO';
  let approval = await getRecords(
    'latest_dynamic_approval',
    `where dynamic_approval_uuid = '${req.body.dynamic_approval_uuid}'`,
  );
  if (!approval.length) throwError('Approval not found', 404);
  let [record] = await getRecords(
    tableMap[approval[0].table_name] || approval[0].table_name,
    `where ${approval[0].record_column_name} = '${approval[0].record_uuid}'`,
  );
  const [user] = await getRecords(
    'latest_user',
    `where user_uuid = '${record.created_by_uuid}'`,
  );

  if (
    !approval[0].approval_uuids.some(
      (ele) =>
        ele.uuid === req.user.user_uuid ||
        ele.uuid === user.role_uuid ||
        ele.uuid === req.user.role_uuid ||
        req.user.role_value === 'ADMIN' ||
        req.user.role_value === 'SUPERADMIN' ||
        req.user.role_value === 'CEO',
    ) &&
    req.body.status !== 'ROLLBACK'
  )
    throwError(400, 'Invalid approver.');
  let userInfo = (
    await getRecords(
      'latest_user',
      `where user_uuid = '${req.user.user_uuid}' AND status="ACTIVE"`,
      null,
      ['first_name', 'last_name'],
    )
  )[0];
  if (!userInfo) throwError(400, 'Invalid user');
  record = await getRecords(
    tableMap[approval[0].table_name] || approval[0].table_name,
    `where ${approval[0].record_column_name} = '${approval[0].record_uuid}'`,
  );
  if (!record.length) throwError('Record not found', 404);
  let approvalCount = (
    await getRecords(
      'latest_dynamic_approval_count',
      `where table_name="${approval[0].table_name}"
      AND dynamic_uuid = "${approval[0].dynamic_uuid}"
      and approval_raise_status="${record[0].status}" and status="ACTIVE"`,
    )
  )[0];
  if (!approvalCount) throwError(400, 'Invalid table for approval count');
  if (req.body.status === 'APPROVED') {
    recordStatus = approval[0].next_status;
    approved_flag = 'YES';
  } else recordStatus = approval[0].previous_status;
  //  status change in corresponding table.
  if (
    approvalCount.level === approval[0].current_level ||
    req.body.status === 'REJECTED' ||
    req.body.status === 'ROLLBACK'
  ) {
    if (approvalCount.link_table) {
      let linkRecord = await getRecords(
        approvalCount.link_table,
        `where ${approvalCount.link_column} = '${record[0][approvalCount.link_column]}'`,
      );
      if (linkRecord.length) {
        await insertRecords(approvalCount.link_table.replace('latest_', ''), {
          ...linkRecord[0],
          status: recordStatus,
        });
      }
    }

    if (!req.body.fields) req.body.fields = {};
    await insertRecords(
      (tableMap[approval[0].table_name] || approval[0].table_name).replace(
        'latest_',
        '',
      ),
      {
        ...record[0],
        approved_flag,
        approved_by_uuid: req.user.user_uuid,
        approved_by_name:
          userInfo.first_name + userInfo.last_name
            ? ' ' + userInfo.last_name
            : '',
        status: recordStatus,
        ...req.body.fields,
        approval_date: setDateTimeFormat('timestamp'),
      },
    );
  } else {
    await insertRecords(
      (tableMap[approval[0].table_name] || approval[0].table_name).replace(
        'latest_',
        '',
      ),
      {
        ...record[0],
        ...req.body.fields,
      },
    );
  }
  req.body = { ...approval[0], ...req.body };
  await insertRecords('dynamic_approval', req.body);

  if (
    approvalCount.level !== approval[0].current_level &&
    req.body.status === 'APPROVED'
  ) {
    // handle special approval

    let special_approval_uuids = Array.isArray(
      record[0]?.special_approval_uuids,
    )
      ? record[0]?.special_approval_uuids
      : [];

    approvalCount.approval_hierarchy[approval[0].current_level]?.map((item) => {
      // dont push if uuid already present in array
      if (item.type === 'USER' && !special_approval_uuids.includes(item.uuid)) {
        special_approval_uuids.push(item.uuid);
      }
    });

    if (special_approval_uuids.length) {
      await insertRecords(
        (tableMap[approval[0].table_name] || approval[0].table_name).replace(
          'latest_',
          '',
        ),
        {
          ...record[0],
          special_approval_uuids: special_approval_uuids,
        },
      );
    }

    // conditional logic

    console.log(approvalCount, 'approvalCount', approval[0]);

    let implemented_approval_hierarchy = conditionApproval(
      approvalCount,
      approval[0].current_level, // level
      record[0],
    );

    console.log(implemented_approval_hierarchy, '..................');

    if (implemented_approval_hierarchy.length) {
      approval[0].approval_uuids = implemented_approval_hierarchy[0].approval;
      approval[0].current_level =
        implemented_approval_hierarchy[0].condition.level;
      approval[0].status = 'REQUESTED';
      approval[0].created_by_uuid = req.user.user_uuid;

      console.log(approval[0], 'approval');

      await insertRecords('dynamic_approval', approval[0]);

      const isCreatorOwnsCurrentApprovalStep =
        await creatorOwnsCurrentApprovalStep(
          implemented_approval_hierarchy,
          record[0],
        );
      if (isCreatorOwnsCurrentApprovalStep) {
        // handle self approval
        const bodyData = {
          dynamic_approval_uuid: req.body.dynamic_approval_uuid,
          status: 'APPROVED',
        };

        await getData(
          `${base_url}/api/v1/dynamicApproval/handle-approval`,
          null,
          'json',
          bodyData,
          'POST',
          req.headers,
        );
      }
    } else {
      console.log('..................no approval hierarchy found.');

      await insertRecords(
        (tableMap[approval[0].table_name] || approval[0].table_name).replace(
          'latest_',
          '',
        ),
        {
          ...record[0],
          status: approval[0].next_status,
        },
      );

      const bodyData = {
        table_name: approval[0].table_name,
        dynamic_uuid: approval[0].dynamic_uuid,
        record_uuid: approval[0].record_uuid,
        record_column_name: approval[0].record_column_name,
      };
      await getData(
        base_url + '/api/v1/dynamicApproval/insert-approval',
        null,
        'json',
        bodyData,
        'POST',
        req.headers,
      );
    }
  } else {
    const bodyData = {
      table_name: approval[0].table_name,
      dynamic_uuid: approval[0].dynamic_uuid,
      record_uuid: approval[0].record_uuid,
      record_column_name: approval[0].record_column_name,
    };
    await getData(
      base_url + '/api/v1/dynamicApproval/insert-approval',
      null,
      'json',
      bodyData,
      'POST',
      req.headers,
    );
  }
  let msg = '';

  async () => {
    switch (req.body.status) {
      case 'APPROVED':
        msg = 'Approved successfully';
        break;
      case 'REJECTED':
        msg = 'Rejected successfully';
        break;
      case 'ROLLBACK':
        msg = 'Rollback successfully';
        break;
    }
    if (req.body.remark) {
      let parent_module_no = '';
      //Add approval modules here in the list. First module found will be used as parent module.
      let module_names = ['product_code', 'order_no', 'enquiry_no'];

      for (let element of module_names) {
        if (record[0].hasOwnProperty(element)) {
          parent_module_no = record[0][element];
          break;
        }
      }
      const bodyData = {
        parent_module_no: parent_module_no,
        module_uuid: req.body.dynamic_approval_uuid,
        module_name: 'APPROVAL',
        comment_remark: req.body.remark,
        status: 'ACTIVE',
        created_by_name: req.user.first_name + ' ' + req.user.last_name,
        created_by_uuid: req.body.created_by_uuid,
      };

      await getData(
        base_url + '/api/v1/comment/upsert-comment',
        null,
        'json',
        bodyData,
        'POST',
        req.headers,
      );
    }
  }; //();

  res.status(200).json(responser(msg, req.body));

  // <------------ Send Email On Action ------------->
  // approvalEmails(req.body.dynamic_approval_uuid, req.user);
};

exports.getApprovals = async (req, res) => {
  const {
    table_name,
    dynamic_uuid,
    billing_company_uuid,
    pageNo,
    itemPerPage,
    from_date,
    to_date,
    status,
    columns,
    value,
  } = req.query;

  let tableName = 'latest_dynamic_approval';
  let filter = filterFunctionality(
    {
      table_name,
      dynamic_uuid,
    },
    status,
    to_date,
    from_date,
    Array.isArray(columns) ? columns : [columns],
    value,
    {
      alias: 'la',
    },
  );

  if (
    req.user.role_value !== 'ADMIN' &&
    req.user.role_value !== 'SUPERADMIN' &&
    req.user.role_value !== 'CEO'
    // || is_true(req.body.is_user_approver)
  ) {
    filter =
      (filter ? `${filter} AND ` : 'WHERE ') +
      `(JSON_CONTAINS(approval_uuids, '{"type": "USER", "uuid": "${req.user.user_uuid}"}')
    or JSON_CONTAINS(approval_uuids, '{"type": "ROLE", "uuid": "${req.user.role_uuid}"}'))`;
  }
  console.log('filter after filter', filter);
  let pageFilter = pagination(pageNo, itemPerPage);
  let result = (
    await dbRequest(`select record_column_name from latest_dynamic_approval 
                  where table_name='${table_name}' ${dynamic_uuid ? `AND dynamic_uuid = '${dynamic_uuid}'` : ''}  limit 1;`)
  )[0];
  console.log('result', result);
  let resultJoined = [];
  let Finalresponse = [];
  if (result) {
    filter = await roleFilterService(
      filter,
      tableMap[table_name] || table_name,
      req.user,
      {
        alias: 'at.',
      },
    );

    console.log('role filter', filter);
    console.log('role2 ');
    resultJoined =
      await dbRequest(`SELECT at.*, la.dynamic_approval_uuid, la.requested_by_uuid, la.status as approval_status FROM latest_dynamic_approval la
    INNER JOIN ${tableMap[table_name] || table_name} at ON record_uuid = ${
      result.record_column_name
    } and at.status  LIKE "%_APPROVAL_REQUESTED" AND at.billing_company_uuid = '${billing_company_uuid}' ${filter} ${pageFilter}`);
    console.log('resultJoined', resultJoined.length);
    // resultJoined =
    //   await dbRequest(`SELECT at.*, la.dynamic_approval_uuid, la.requested_by_uuid, la.status as approval_status FROM latest_dynamic_approval la
    // INNER JOIN ${tableMap[table_name] || table_name} at ON record_uuid = ${
    //   result.record_column_name
    // } and at.status = "${table_name
    //   .replace('latest_', '')
    //   .toUpperCase()}_APPROVAL_REQUESTED" ${filter} ${pageFilter}`);

    Finalresponse = await Promise.all(
      resultJoined?.map(async (ele) => {
        mergeApproval = await getData(
          base_url + '/api/v1/dynamicApproval/merge-approval-record',
          null,
          'json',
          {
            // TODO: change hardcode expense to dynmaic one
            record_uuid: ele.expense_uuid,
            dynamic_uuid: ele.expense_category_uuid,
            table_name: table_name,
            data: {},
          },
          'POST',
          req.headers,
        );
        console.log('Finalresponse', mergeApproval);
        if (mergeApproval) {
          const { dynamic_approval_uuid, requested_by_uuid, is_user_approver } =
            mergeApproval; // Destructure for direct assignments
          return {
            ...ele,
            dynamic_approval_uuid,
            requested_by_uuid,
            is_user_approver,
          };
        } else {
          return ele;
        }
      }),
    );
  }

  return res.json(responser('Approvals ', Finalresponse, Finalresponse.length));
};
exports.insertApprovalCount = async (req, res) => {
  removeNullValueKey(req.body);
  const {
    table_name,
    dynamic_uuid,
    approval_hierarchy,
    dynamic_approval_count_uuid,
    link_table,
    link_column,
  } = req.body;
  // if (!tableMap[table_name]) {
  //   let isTableExist = await isTableOrViewExist(table_name);
  //   if (!isTableExist) throwError(400, 'Invalid Table name');
  // }
  if (link_table && link_column) {
    let isColumnExist1 = await isColumnExistInTable(table_name, link_column);
    let isColumnExist2 = await isColumnExistInTable(link_table, link_column);
    if (!isColumnExist1 || !isColumnExist2)
      throwError(400, 'Invalid Column name');
  }
  let promiseArr = [];
  for (let arr of approval_hierarchy) {
    promiseArr.push(
      arr.map((ele) => {
        if (ele.type === 'ROLE') {
          return isValidRecord('latest_roles', {
            role_uuid: ele.uuid,
            status: 'ACTIVE',
          });
        } else {
          return isValidRecord('latest_user', {
            user_uuid: ele.uuid,
            status: 'ACTIVE',
          });
        }
      }),
    );
  }
  for (let j in promiseArr) {
    let respPromise = await Promise.all(promiseArr[j]);
    if (!respPromise.every((i) => i === 1)) {
      let indexOFZero = respPromise.indexOf(0);
      let type = approval_hierarchy[j][indexOFZero].type;
      throwError(
        400,
        `At level ${+j + 1}, invalid ${type} at position ${indexOFZero + 1}`,
      );
    }
  }
  req.body.level = approval_hierarchy.length;
  if (dynamic_approval_count_uuid) {
    let approvalCount = (
      await getRecords(
        'latest_dynamic_approval_count',
        `where dynamic_approval_count_uuid="${dynamic_approval_count_uuid}"`,
      )
    )[0];
    if (!approvalCount) throwError(400, 'Invalid Approval count for update');
    req.body = { ...approvalCount, ...req.body };
  } else {
    req.body.dynamic_approval_count_uuid = uuidv4();
    req.body.create_ts = setDateTimeFormat('timestamp');
  }
  await insertRecords('dynamic_approval_count', req.body);
  // <----------- Insert in Approval immediately too for reflection --------------------->

  let updateApproval = [];
  let currentApprovals = await getRecords(
    'latest_dynamic_approval',
    `where table_name='${table_name}' and dynamic_uuid='${dynamic_uuid}' and status='REQUESTED'`,
  );
  if (currentApprovals.length) {
    for (let i = 0; i < currentApprovals.length; i++) {
      if (approval_hierarchy[currentApprovals[i].current_level - 1]) {
        currentApprovals[i].approval_uuids =
          approval_hierarchy[currentApprovals[i].current_level - 1];
        updateApproval.push(currentApprovals[i]);
      }
    }
    if (updateApproval.length)
      await insertRecords('dynamic_approval', updateApproval);
  }

  res.json(
    responser(`Approval has been set for table ${table_name}`, req.body),
  );
};

exports.getApprovalCount = async (req, res) => {
  const {
    dynamic_approval_count_uuid,
    dynamic_table_name,
    dynamic_uuid,
    table_name,
    pageNo,
    itemPerPage,
    from_date,
    to_date,
    status,
    columns,
    value,
    pageLimit,
    advanceFilter,
  } = req.query;

  let tableName = 'latest_dynamic_approval_count';
  let filter = filterFunctionality(
    {
      dynamic_approval_count_uuid,
      dynamic_table_name,
      table_name,
      dynamic_uuid,
    },
    status,
    to_date,
    from_date,
    Array.isArray(columns) ? columns : [columns],
    value,
  );
  filter = await roleFilterService(filter, 'latest_customer', req.user);
  if (advanceFilter) filter = advanceFiltering(filter, advanceFilter);

  let pageFilter = pagination(pageNo, itemPerPage, pageLimit);
  let totalRecords = await getCountRecord(tableName, filter);
  let result = await getRecords(tableName, filter, pageFilter, null, {
    includeUniqueId: false,
  });
  return res.json(
    responser('Approval Count list', result, result.length, totalRecords),
  );
};

exports.mergeApprovalWithRecord = async (req, res) => {
  let { record_uuid, table_name, dynamic_uuid, data } = req.body;
  let approvalCount = await getRecords(
    'latest_dynamic_approval_count',
    `where table_name = "${table_name}" AND dynamic_uuid = "${dynamic_uuid}"  and status = "ACTIVE"`,
  );
  if (!approvalCount.length) {
    return res.json(data);
  }
  let approvalRecord = await getRecords(
    'latest_dynamic_approval',
    `where status='REQUESTED' and table_name='${table_name}' AND dynamic_uuid = "${dynamic_uuid}" and record_uuid='${record_uuid}'`,
    null,
    ['dynamic_approval_uuid', 'requested_by_uuid', 'approval_uuids'],
  );

  if (approvalRecord.length) {
    console.log('approvalRecord: ', approvalRecord[0].approval_uuids);
    let is_user_approver = approvalRecord[0].approval_uuids.some(
      (ele) =>
        ele.uuid === req.user.user_uuid ||
        ele.uuid === req.user.role_uuid ||
        req.user.role_value === 'ADMIN' ||
        req.user.role_value === 'SUPERADMIN' ||
        req.user.role_value === 'CEO',
    );
    deleteKeyValuePair(approvalRecord[0], ['approval_uuids']);
    data = { ...data, ...approvalRecord[0], is_user_approver };
  } else {
    let nonApprovalRecord = await getRecords(
      'latest_dynamic_approval',
      `where (status='REJECTED' OR status='APPROVED') and table_name='${table_name}' AND dynamic_uuid = "${dynamic_uuid}"  and record_uuid='${record_uuid}'`,
      null,
      ['remark'],
    );
    if (nonApprovalRecord.length) {
      data = { ...data, ...nonApprovalRecord[0] };
    }
  }
  return res.json(data);
};

exports.getTableStatus = async (req, res) => {
  const { module_name, submodule_name, table_name } = req.query;

  let tableName = 'tables_reference';
  let result = await dbRequest(
    `select * from ${tableName} where module_name='${module_name}'
    and submodule_name='${submodule_name}'
    and table_name='${table_name}'`,
  );
  return res.json(
    responser('All status for the table : ', result, result.length),
  );
};

exports.getDynamicApprovalHistory = async (req, res) => {
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
