const { McpServer } = require('@modelcontextprotocol/sdk/server/mcp.js');
const { z } = require('zod');
const {
  getCurrentUserInformation,
  upsertProject,
  getProject,
  upsertTask,
  getTask,
  getAllUser,
  upsertProjectTeamMember,
  getProjectTeamMember,
} = require('./mcpHelperFunction');

const McpServerInstance = new McpServer({
  name: 'example-server',
  version: '1.0.0',
});

McpServerInstance.tool(
  'getCurrentUserInformation',
  'Provide the all information of current user who is logged in or using the ai ',
  {},
  getCurrentUserInformation,
);

McpServerInstance.tool(
  'getAllUsersInformation',
  'get the information of all users exist in database',
  {
    user_profile_id: z
      .number()
      .int()
      .optional()
      .describe('Numeric ID of the user profile'),
    user_uuid: z.string().max(50).optional().describe('UUID of the user'),
    role_uuid: z.string().optional().describe("UUID of the user's role"),

    role_value: z
      .string()
      .optional()
      .describe(
        'Value of the role SUPERADMIN, ADMIN, PROJECT_MANAGER, USER, FINANCE_MANAGER, CATEGORY_MANAGER, CEO ',
      ),
    pageNo: z
      .number()
      .int()
      .min(1)
      .describe('Current page number for pagination (min 1)'),
    itemPerPage: z
      .number()
      .int()
      .min(1)
      .describe('Number of items per page for pagination (min 1)'),
    from_date: z
      .string()
      .optional()
      .describe('Start date in YYYY-MM-DD format'),
    to_date: z.string().optional().describe('End date in YYYY-MM-DD format'),
    status: z
      .string()
      .optional()
      .describe('Status filter (e.g., ACTIVE, INACTIVE)'),
    columns: z
      .string()
      .optional()
      .describe('Comma-separated list in array of columns to include'),
    value: z.string().optional().describe('Search or filter value'),
  },
  getAllUser,
);

// McpServerInstance.tool(
//   'getTask',
//   'Provide the all list of task ',

//   {
//     task_uuid: z.string().optional().describe('UUID of the task'),
//     pageNo: z
//       .number()
//       .int()
//       .min(1)
//       .optional()
//       .describe('Current page number (min 1)'),
//     itemPerPage: z
//       .number()
//       .int()
//       .min(1)
//       .optional()
//       .describe('Number of items per page (min 1)'),
//     from_date: z
//       .string()

//       .optional()
//       .describe('Start date YYYY-MM-DD'),
//     to_date: z
//       .string()

//       .optional()
//       .describe('End date YYYY-MM-DD'),
//     status: z.string().optional().describe('Status filter'),
//     columns: z
//       .string()
//       .optional()
//       .describe('Comma-separated list array of columns to include'),
//     value: z.string().optional().describe('Generic filter or search value'),
//   },
//   getTask,
// );

// McpServerInstance.tool(
//   'upsertTask',
//   'update and insert task if we provide uuid task gone be update if we not provide uuid then new task will insert',

//   {
//     task_uuid: z
//       .string()
//       .optional()
//       .describe('Optional task UUID as a string.'),

//     project_name: z
//       .string()
//       .describe('Name of the project (e.g., project name).'),
//     project_uuid: z.string().describe('UUID of the project.'),

//     title: z.string().describe('Title of the task.'),

//     description: z.string().optional().describe('Description of the task.'),

//     due_date: z
//       .string()
//       .optional()
//       .describe('Due date as string in ISO format.'),

//     priority: z
//       .string()
//       .optional()
//       .describe('Priority of the task: HIGH, MEDIUM, or LOW.'),

//     project_manager: z
//       .string()
//       .optional()
//       .describe('Optional name of the project manager.'),

//     project_manager_uuid: z
//       .string()
//       .optional()
//       .describe('Optional UUID of the project manager.'),

//     assigned_to_name: z.string().describe('Name of the assignee.'),

//     assigned_to_uuid: z.string().describe('UUID of the assignee.'),

//     status: z
//       .string()
//       .describe(
//         'Status of the task (e.g., TODO, PROGRESS, HOLD, COMPLETED, ARCHIVE).',
//       ),
//   },

//   upsertTask,
// );

McpServerInstance.tool(
  'getProject',
  'Provide the all information of Projects ',
  {
    project_uuid: z.string().optional().describe('UUID of the project'),
    pageNo: z
      .number()
      .int()
      .min(1)
      .describe('Page number for pagination (minimum 1)'),
    itemPerPage: z
      .number()
      .int()
      .min(1)
      .describe('Number of items per page (minimum 1)'),
    from_date: z
      .string()
      .optional()
      .describe('Start date in YYYY-MM-DD format'),
    to_date: z.string().optional().describe('End date in YYYY-MM-DD format'),
    status: z.string().optional().describe('Optional filter by status'),
    columns: z
      .string()
      .optional()
      .describe('Comma-separated list of column names'),
    value: z.string().optional().describe('Search or filter value'),
  },
  getProject,
);

McpServerInstance.tool(
  'upsertProject',
  'update and insert project if we provide uuid project gone be update if we not provide uuid then new project will insert',
  {
    project_uuid: z
      .string()
      .optional()
      .describe('UUID of the project (can be empty or null)'),

    project_name: z.string().describe('Name of the project (required)'),

    legal_entity: z
      .string()
      .max(100)
      .optional()
      .describe('Optional legal entity name, max 100 characters'),
    remarks: z
      .string()
      .max(100)
      .optional()
      .describe('Optional remarks, max 100 characters'),
    start_date: z
      .string()
      .max(100)
      .optional()
      .describe('Start date as string, YYYY-MM-DD'),
    end_date: z
      .string()
      .max(100)
      .optional()
      .describe('End date as string, YYYY-MM-DD'),

    project_manager_name: z
      .string()
      .describe('Name of the project manager (required)'),
    project_manager_uuid: z
      .string()
      .describe('UUID of the project manager (required)'),

    finance_manager_name: z
      .string()
      .describe('Name of the finance manager (required)'),
    finance_manager_uuid: z
      .string()
      .describe('UUID of the finance manager (required)'),
    status: z.string().describe('Status of the project (ACTIVE or INACTIVE)'),
  },
  upsertProject,
);

McpServerInstance.tool(
  'getProjectTeamMember',
  'Provide the member list of Projects Team and some time project have no team member',
  {
    project_uuid: z.string().describe('UUID of the project required'),
    pageNo: z
      .number()
      .int()
      .min(1)
      .describe('Page number for pagination (minimum 1)'),
    itemPerPage: z
      .number()
      .int()
      .min(1)
      .describe('Number of items per page (minimum 1)'),
    from_date: z
      .string()
      .optional()
      .describe('Start date in YYYY-MM-DD format'),
    to_date: z.string().optional().describe('End date in YYYY-MM-DD format'),
    status: z.string().optional().describe('Optional filter by status'),
    columns: z
      .string()
      .optional()
      .describe('Comma-separated list of column names'),
    value: z.string().optional().describe('Search or filter value'),
  },
  getProjectTeamMember,
);

McpServerInstance.tool(
  'upsertProjectTeamMember',
  'update and insert project team member if we provide uuid project team member gone be update if we not provide uuid then new project team member will insert',
  {
    project_team_uuid: z
      .string()
      .optional()
      .describe('UUID of the project team'),
    project_uuid: z.string().describe('UUID of the project required'),
    project_name: z.string().describe('Name of the project required'),
    user_uuid: z.string().describe('UUID of the user  required'),
    user_name: z.string().describe('Name of the user required'),
    status: z.string().describe('Status of the project team member'),
  },
  upsertProjectTeamMember,
);

module.exports = McpServerInstance;
