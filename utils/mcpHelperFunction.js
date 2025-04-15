const { base_url } = require('../config/server.config');
const { apiRequest } = require('./helperFunction');

const billing_company_uuid = '4b7ecf35-611c-433a-82ec-3124833f29af';
const billing_company_name = 'Sharma Sawhney and Co.';
const auth_token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdF9uYW1lIjoiVmlzaGFsIiwidXNlcl91dWlkIjoiNTIyYmMwMGUtNjk1My00ODJjLThjYTItOTljMTYyYmM2YWRjIiwiZW1haWwiOiJ2aXNoYWxAZWRnZW5yb290cy5uZXQiLCJyb2xlX3V1aWQiOiJjNTBlYzc5OC03NDk1LTQ2YmEtYjc4ZC1jZTc2ZDBkNmI2ZjgiLCJyb2xlX25hbWUiOiJTdXBlcmFkbWluIiwicm9sZV92YWx1ZSI6IlNVUEVSQURNSU4iLCJicmFuY2hfdXVpZCI6ImNlOWM4ZWM2LTBlYzctNDY4Ny04NzhlLWMxYzEzNTllNGI4ZSIsImlhdCI6MTc0NDY1NTc0NX0.ZJQzNfDv61giJJ3cCfovwP52ZPXI-yWzbHwRj8MkD-c';

exports.getCurrentUserInformation = async (arg) => {
  const response = await apiRequest(
    base_url +
      '/api/v1/user/get-user?user_uuid=522bc00e-6953-482c-8ca2-99c162bc6adc',
    null,
    'json',
    null,
    'GET',
    {
      'auth-token': auth_token,
    },
  );

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(response),
      },
    ],
  };
};

exports.getAllUser = async (arg) => {
  const {
    user_uuid,
    user_profile_id,
    role_uuid,

    role_group,
    role_value,
    pageNo,
    itemPerPage,
    from_date,
    to_date,
    status,
    columns,
    value,
  } = arg;

  const response = await apiRequest(
    base_url +
      `/api/v1/user/get-user?${user_uuid ? `user_uuid=${user_uuid}` : ''}${
        user_profile_id ? `&user_profile_id=${user_profile_id}` : ''
      }${role_uuid ? `&role_uuid=${role_uuid}` : ''}${
        billing_company_uuid
          ? `&billing_company_uuid=${billing_company_uuid}`
          : ''
      }${role_group ? `&role_group=${role_group}` : ''}${
        role_value ? `&role_value=${role_value}` : ''
      }${pageNo ? `&pageNo=${pageNo}` : ''}${
        itemPerPage ? `&itemPerPage=${itemPerPage}` : ''
      }${from_date ? `&from_date=${from_date}` : ''}${
        to_date ? `&to_date=${to_date}` : ''
      }${status ? `&status=${status}` : ''}${
        columns ? `&columns=${columns}` : ''
      }${value ? `&value=${value}` : ''}`,
    null,
    'json',
    null,
    'GET',
    {
      'auth-token': auth_token,
    },
  );

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(response),
      },
    ],
  };
};

exports.upsertProject = async (arg) => {
  const {
    project_uuid,
    project_name,
    legal_entity,
    remarks,
    start_date,
    end_date,
    project_manager_name,
    project_manager_uuid,
    finance_manager_name,
    finance_manager_uuid,
    status,
  } = arg;

  console.log('arg', arg);
  const response = await apiRequest(
    base_url + `/api/v1/project/upsert-project`,
    null,
    'json',
    {
      project_uuid,
      project_name,
      legal_entity,
      remarks,
      start_date,
      end_date,
      billing_company_uuid: billing_company_uuid,
      billing_company_name: billing_company_name,
      project_manager_name,
      project_manager_uuid,
      finance_manager_name,
      finance_manager_uuid,
      status,
    },
    'POST',
    {
      'content-type': 'application/json; charset=UTF-8',
      'auth-token': auth_token,
    },
  );
  console.log('response', response);
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(response),
      },
    ],
  };
};
exports.getProject = async (arg) => {
  const {
    project_uuid,
    pageNo,
    itemPerPage,
    from_date,
    to_date,
    status,
    columns,
    value,
  } = arg;

  const response = await apiRequest(
    base_url +
      `/api/v1/project/get-project?billing_company_uuid=${billing_company_uuid}${project_uuid ? `&project_uuid=${project_uuid}` : ''}${pageNo ? `&pageNo=${pageNo}` : ''}${itemPerPage ? `&itemPerPage=${itemPerPage}` : ''}${from_date ? `&from_date=${from_date}` : ''}${to_date ? `&to_date=${to_date}` : ''}${status ? `&status=${status}` : ''}${columns ? `&columns=${columns}` : ''}${value ? `&value=${value}` : ''}`,
    null,
    'json',
    null,
    'GET',
    {
      'auth-token': auth_token,
    },
  );

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(response),
      },
    ],
  };
};

exports.getProjectTeamMember = async (arg) => {
  const {
    project_uuid,
    pageNo,
    itemPerPage,
    from_date,
    to_date,
    status,
    columns,
    value,
  } = arg;

  const response = await apiRequest(
    base_url +
      `/api/v1/project/get-project-team?project_uuid=${project_uuid}${pageNo ? `&pageNo=${pageNo}` : ''}${itemPerPage ? `&itemPerPage=${itemPerPage}` : ''}${from_date ? `&from_date=${from_date}` : ''}${to_date ? `&to_date=${to_date}` : ''}${status ? `&status=${status}` : ''}${columns ? `&columns=${columns}` : ''}${value ? `&value=${value}` : ''}`,
    null,
    'json',
    null,
    'GET',
    {
      'auth-token': auth_token,
    },
  );

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(response),
      },
    ],
  };
};
exports.upsertProjectTeamMember = async (arg) => {
  const {
    project_team_uuid,
    project_uuid,
    project_name,
    user_uuid,
    user_name,
    status,
  } = arg;

  const response = await apiRequest(
    base_url + `/api/v1/project/upsert-project-team`,
    null,
    'json',
    {
      project_team_uuid,
      project_uuid,
      project_name,
      user_uuid,
      user_name,
      status,
    },
    'POST',
    {
      'content-type': 'application/json; charset=UTF-8',
      'auth-token': auth_token,
    },
  );
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(response),
      },
    ],
  };
};

exports.getTask = async (arg) => {
  const {
    task_uuid,
    pageNo,
    itemPerPage,
    from_date,
    to_date,
    status,
    columns,
    value,
  } = arg;
  const response = await apiRequest(
    base_url +
      `/api/v1/task/get-task?billing_company_uuid=${billing_company_uuid}${project_uuid ? `&task_uuid=${task_uuid}` : ''}${pageNo ? `&pageNo=${pageNo}` : ''}${itemPerPage ? `&itemPerPage=${itemPerPage}` : ''}${from_date ? `&from_date=${from_date}` : ''}${to_date ? `&to_date=${to_date}` : ''}${status ? `&status=${status}` : ''}${columns ? `&columns=${columns}` : ''}${value ? `&value=${value}` : ''}`,
    null,
    'json',
    null,
    'GET',
    {
      'auth-token': auth_token,
    },
  );

  console.log(response);
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(response),
      },
    ],
  };
};
exports.upsertTask = async (arg) => {
  const {
    task_uuid,
    project_name,
    project_uuid,
    title,
    description,
    due_date,
    priority,
    project_manager,
    project_manager_uuid,
    assigned_to_name,
    assigned_to_uuid,
    status,
  } = arg;
  const response = await apiRequest(
    base_url + `/api/v1/task/upsert-task`,
    null,
    'json',
    {
      task_uuid,
      type: 'project',
      type_name: project_name,
      type_uuid: project_uuid,
      billing_company_name,
      billing_company_uuid,
      title,
      description,
      due_date,
      priority,
      category_name: '',
      category_uuid: '',
      project_manager,
      project_manager_uuid,
      assigned_to_name,
      assigned_to_uuid,
      status,
    },
    'POST',
    {
      'content-type': 'application/json; charset=UTF-8',
      'auth-token': auth_token,
    },
  );
  console.log('response', response);
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(response),
      },
    ],
  };
};
