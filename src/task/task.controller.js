const {
  pagination,
  filterFunctionality,
  getCountRecord,
  getRecords,
  insertRecords,
  isValidRecord,
  isEditAccess,
  roleFilterService,
} = require('../../utils/dbFunctions');
const {
  responser,
  removeNullValueKey,
  setDateTimeFormat,
  throwError,
  getData,
} = require('../../utils/helperFunction');
const { v4: uuid } = require('uuid');
const { base_url } = require('../../config/server.config');
const { CronJob } = require('cron');

exports.upsertTask = async (req, res) => {
  await isEditAccess('latest_tasks', req.user);
  removeNullValueKey(req.body);
  console.log('req.body', req.body);
  let isUpadtion = false;
  if (req.body.task_uuid) {
    isUpadtion = true;
    let task_info = await getRecords(
      'latest_tasks',
      `where task_uuid='${req.body.task_uuid}'`,
    );
    if (!task_info.length) throwError(404, 'Task not found.');
    task_info = task_info[0];
    req.body.modified_by_uuid = req.body.created_by_uuid;
    req.body.created_by_uuid = task_info.created_by_uuid;
    req.body = { ...task_info, ...req.body };
  } else {
    req.body.create_ts = setDateTimeFormat('timestemp');
    req.body.dueDate = setDateTimeFormat('timestemp', req.body.dueDate);
    req.body.task_uuid = uuid();
  }

  let { type, type_uuid } = req.body;
  type = type.toLowerCase();
  let tableName = `latest_${type}`;

  const isTypeExists = await isValidRecord(tableName, {
    [`${type}_uuid`]: type_uuid,
  });
  if (!isTypeExists) {
    throwError(400, `Type '${type}' not found or invalid.`);
  }

  const isUserExists = await isValidRecord('latest_user', {
    user_uuid: req.body.assigned_to_uuid,
  });
  if (!isUserExists) {
    throwError(400, `Assigned User not found .`);
  }

  await insertRecords('tasks', req.body);
  res.json(responser('Tasks created successfully.', req.body));
  // Send Mail
  (async () => {
    try {
      let userInfoReceiver = (
        await getRecords(
          'latest_user',
          `where user_uuid= '${req.body.assigned_to_uuid}'`,
        )
      )[0];
      if (!userInfoReceiver)
        throwError(400, `User does not exist in table user`);
      let receiverEmail = userInfoReceiver.email;
      let receiverName = userInfoReceiver.first_name;

      let userInfoSender = (
        await getRecords(
          'latest_user',
          `where user_uuid= '${req.body.created_by_uuid}'`,
        )
      )[0];

      let bodyMail = `
            <h1>${userInfoReceiver.first_name} a new task has been assigned to you </h1>
            <h1>${req.body.title}</h1>
            <p>Subject: Task Assigned</p>
            <p>Dear ${userInfoReceiver.first_name},</p>
          <h3>You have been assigned new Task</h3>
        
          
          `;

      const bodyData = {
        module_name: 'Task',
        module_uuid: req.body.task_uuid,
        emails: [receiverEmail],
        subject: 'New Task Assigned ',
        body: bodyMail,
        cc: req.body.cc,
        bcc: req.body.bcc,
      };

      await getData(
        base_url + '/api/v1/general/send-grid-email',
        null,
        'json',
        bodyData,
        'POST',
        req.headers,
      );
    } catch (error) {
      console.log(error);
    }
  })();

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
        historyMessage = `${userInfo?.first_name} has made an update in Task`;
      } else {
        historyMessage = `${userInfo?.first_name} has created a Task`;
      }
      const bodyData = {
        module_name: 'Task',
        module_uuid: req.body.task_uuid,
        message: historyMessage,
        module_column_name: 'task_uuid',
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

exports.getTask = async (req, res) => {
  const {
    task_user_taskboard_id,
    task_uuid,
    pageNo,
    itemPerPage,
    from_date,
    to_date,
    status,
    columns,
    value,
  } = req.query;
  let tableName = 'latest_tasks';
  let filter = filterFunctionality(
    {
      task_user_taskboard_id,
      task_uuid,
    },
    status,
    to_date,
    from_date,
    Array.isArray(columns) ? columns : [columns],
    value,
  );

  filter = await roleFilterService(filter, tableName, req.user);

  let pageFilter = pagination(pageNo, itemPerPage);
  let result = await getRecords(tableName, filter, pageFilter);
  console.log('result: ', result);

  let groupedTasks = {};

  result.forEach((task) => {
    if (!groupedTasks[task.status]) {
      groupedTasks[task.status] = [];
    }
    groupedTasks[task.status].push(task);
  });

  return res.json({
    message: 'All Tasks according to status.',
    totalRecords: result.length,
    data: groupedTasks,
  });
};

exports.getTaskList = async (req, res) => {
  const {
    task_user_taskboard_id,
    task_uuid,
    pageNo,
    itemPerPage,
    from_date,
    to_date,
    status,
    columns,
    value,
  } = req.query;

  let tableName = 'latest_tasks';
  let filter = filterFunctionality(
    {
      task_user_taskboard_id,
      task_uuid,
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
    responser('Task List: ', result, result.length, totalRecords),
  );
};

exports.getTaskCalender = async (req, res) => {
  let tableName = 'latest_tasks';

  let filter = await roleFilterService(null, tableName, req.user);

  let result = await getRecords(tableName, filter);

  // Transform the result to include only the required fields and rename some fields
  let transformedResult = result.map((task) => ({
    task_uuid: task.task_uuid,
    type: task.type,
    status: task.status,
    title: task.title,
    start: task.create_ts,
    end: task.due_date,
  }));

  return res.json(responser('Calender Task Data: ', transformedResult));
};

exports.upsertTaskDefinition = async (req, res) => {
  await isEditAccess('latest_task_definition', req.user);
  removeNullValueKey(req.body);
  console.log('req.body', req.body);
  let isUpadtion = false;
  if (req.body.task_definition_uuid) {
    isUpadtion = true;
    let task_definition_info = await getRecords(
      'latest_task_definition',
      `where task_definition_uuid='${req.body.task_definition_uuid}'`,
    );
    if (!task_definition_info.length)
      throwError(404, 'Task Definition not found.');
    task_definition_info = task_definition_info[0];
    req.body = { ...task_definition_info, ...req.body };
  } else {
    req.body.create_ts = setDateTimeFormat('timestemp');
    req.body.dueDate = setDateTimeFormat('timestemp', req.body.dueDate);
    req.body.task_definition_uuid = uuid();
  }

  let { type, type_uuid } = req.body;
  type = type.toLowerCase();
  let tableName = `latest_${type}`;

  const isTypeExists = await isValidRecord(tableName, {
    [`${type}_uuid`]: type_uuid,
  });
  if (!isTypeExists) {
    throwError(400, `Type '${type}' not found or invalid.`);
  }

  const isUserExists = await isValidRecord('latest_user', {
    user_uuid: req.body.assigned_to_uuid,
  });
  if (!isUserExists) {
    throwError(400, `Assigned User not found .`);
  }

  function getDayName(dayIndex) {
    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    return days[dayIndex];
  }

  // Function to construct task_details based on task type
  function constructTaskDetails(taskType, data) {
    let taskDetails = '';
    switch (taskType) {
      case 'date':
        taskDetails = data.task_date;
        break;
      case 'weekly':
        taskDetails = getDayName(data.task_day_of_week);
        break;
      case 'weekdays':
        const weekdays = data.task_weekdays.map((day) => getDayName(day));
        taskDetails = weekdays.join(', ');
        break;
      case 'monthly':
        taskDetails = data.task_day_of_month.toString();
        break;
      case 'yearly':
        taskDetails = `${data.task_day_of_month} ${data.task_month}`;
        break;
      case 'daily':
        taskDetails = data.task_time;
        break;
      case 'interval':
        taskDetails = `${data.task_interval} days`;
        break;
      default:
        taskDetails = '';
    }
    return taskDetails;
  }

  const taskType = req.body.task_type;

  req.body.task_details = constructTaskDetails(taskType, req.body);

  await insertRecords('task_definition', req.body);
  res.json(
    responser('Tasks Definition created or updated successfully.', req.body),
  );

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
        historyMessage = `${userInfo?.first_name} has made an update in Task Definition`;
      } else {
        historyMessage = `${userInfo?.first_name} has created a Task Definiton`;
      }
      const bodyData = {
        module_name: 'Task Definition',
        module_uuid: req.body.task__definition_uuid,
        message: historyMessage,
        module_column_name: 'task__definition_uuid',
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

exports.getTaskDefinition = async (req, res) => {
  const {
    task_definition_id,
    task_definition_uuid,
    pageNo,
    itemPerPage,
    from_date,
    to_date,
    status,
    columns,
    value,
  } = req.query;
  let tableName = 'latest_task_definition';
  let filter = filterFunctionality(
    {
      task_definition_id,
      task_definition_uuid,
    },
    status,
    to_date,
    from_date,
    Array.isArray(columns) ? columns : [columns],
    value,
  );

  filter = await roleFilterService(filter, tableName, req.user);

  let pageFilter = pagination(pageNo, itemPerPage);
  let result = await getRecords(tableName, filter, pageFilter);

  let groupedTasks = {};

  result.forEach((task) => {
    if (!groupedTasks[task.status]) {
      groupedTasks[task.status] = [];
    }
    groupedTasks[task.status].push(task);
  });

  return res.json({
    message: 'All Tasks according to status.',
    totalRecords: result.length,
    data: groupedTasks,
  });
};

// // Define the function to check for tasks based on task definitions and execute upsertTask
// async function checkAndExecuteTasks() {
//   try {
//     // Query task_definition table to retrieve tasks to be executed
//     const taskDefinitions = await getRecords('latest_task_definition'); // Adjust this query based on your database schema
//     console.log("Task Definition: ", taskDefinitions);

//     // Iterate over each task definition
//     for (const taskDefinition of taskDefinitions) {
//       // Determine if the task should be executed based on its schedule
//       if (shouldExecuteTask(taskDefinition)) {
//         // Call the upsertTask function with the task details
//         console.log("Task Definition Single:", taskDefinition);
//         try {

//       } catch (error) {
//           console.log(error);
//         }
//         const body = {
//           type: taskDefinition.type,
//           type_name: taskDefinition.type_name,
//           type_uuid: taskDefinition.type_uuid,
//           title: taskDefinition.title,
//           description: taskDefinition.description,
//           dueDate: taskDefinition.dueDate,
//           uploadFile: taskDefinition.uploadFile,
//           priority: taskDefinition.priority,
//           assigned_to_name: taskDefinition.assigned_to_name,
//           assigned_to_uuid: taskDefinition.assigned_to_uuid,
//           status: taskDefinition.status,
//           created_by_uuid: taskDefinition.created_by_uuid,
//         }
//         await exports.upsertTask(taskDefinition); // Assuming upsertTask accepts a task definition object
//       }
//     }
//   } catch (error) {
//     console.error('Error in checkAndExecuteTasks:', error);
//   }
// }

// Define the function to check for tasks based on task definitions and execute upsertTask
async function checkAndExecuteTasks() {
  try {
    // Query task_definition table to retrieve tasks to be executed
    const taskDefinitions = await getRecords('latest_task_definition');
    console.log('Task Definition: ', taskDefinitions);

    // Iterate over each task definition
    for (const taskDefinition of taskDefinitions) {
      // Determine if the task should be executed based on its schedule
      // if (shouldExecuteTask(taskDefinition)) {
      const schedule = generateCronSchedule(taskDefinition);
      console.log('Schedule in task d single: ', schedule);

      // Call the upsertTask function with the task details
      console.log('Task Definition Single:', taskDefinition);
      const job = new CronJob(schedule, async () => {
        try {
          console.log('Running cron job...');
          const body = {
            type: taskDefinition.type,
            type_name: taskDefinition.type_name,
            type_uuid: taskDefinition.type_uuid,
            title: taskDefinition.title,
            description: taskDefinition.description,
            dueDate: taskDefinition.dueDate,
            upload_file: taskDefinition.upload_file,
            priority: taskDefinition.priority,
            category_name: taskDefinition.category_name,
            category_uuid: taskDefinition.category_uuid,
            project_manager: taskDefinition.project_manager,
            project_manager_uuid: taskDefinition.project_manager_uuid,
            assigned_to_name: taskDefinition.assigned_to_name,
            assigned_to_uuid: taskDefinition.assigned_to_uuid,
            status: taskDefinition.status,
            created_by_uuid: taskDefinition.created_by_uuid,
          };
          console.log('body: ', body);
          const user = await getRecords(
            'user_session',
            `where user_uuid= '${taskDefinition.created_by_uuid}'`,
          );
          const header = {
            'auth-Token': user[0].access_token,
          };
          await getData(
            base_url + '/api/v1/task/upsert-task',
            null,
            'json',
            body,
            'POST',
            header,
          );

          console.log('Cron job completed.');
        } catch (error) {
          console.error('Error running cron job:', error);
        }
      });

      job.start();

      // }
    }
  } catch (error) {
    console.error('Error in checkAndExecuteTasks:', error);
  }
}

// checkAndExecuteTasks();
const cronSchedule = '7 * * * *'; // Run every hour.

// Create the cron job
const job = new CronJob(cronSchedule, async () => {
  try {
    console.log('Running cron job...');
    await checkAndExecuteTasks();
    console.log('Cron job completed.');
  } catch (error) {
    console.error('Error running cron job:', error);
  }
});

// Start the cron job
job.start();

// function shouldExecuteTask(taskDefinition) {
//   // Implement your logic here to determine if the task should be executed
//   // Use the fields in taskDefinition to determine the schedule and current time
//   // Return true if the task should be executed, false otherwise
//   // Example: Implement logic based on task_type, task_time, task_date, etc.
//   const schedule = generateCronSchedule(taskDefinition);
//   console.log("Schedule: ", schedule);
//   if(taskDefinition.task_type == 'daily'){
//     return true;
//   }

// }

// Function to generate cron schedule based on task definition
function generateCronSchedule(taskDefinition) {
  // const { task_type, task_time, task_date } = taskDefinition;
  const {
    task_type,
    task_time,
    task_date,
    task_day_of_week,
    task_weekdays,
    task_day_of_month,
    task_month,
    task_year,
    task_interval,
  } = taskDefinition;
  console.log('task_type: ', task_type);
  console.log('Task Definition: ', taskDefinition);

  // Default cron schedule
  let cronSchedule = '0 * * * *'; // Run every hour by default

  // let cronSchedule = '0 0 * * *'; //for midnight 12am

  // Generate cron schedule based on task type
  switch (task_type) {
    case 'time':
      // Example: task_time is '15:30'
      const [hours, minutes] = task_time.split(':');
      cronSchedule = `${minutes} ${hours} * * *`; // Run at the specified time every day

      break;
    case 'date':
      // Example: task_date is a specific date
      const date = new Date(task_date);
      const day = date.getDate();
      const month = date.getMonth() + 1; // Months are zero-based in JavaScript
      const year = date.getFullYear();
      if (task_time) {
        // If task_time is present, use both task_date and task_time
        const [hours, minutes] = task_time.split(':');
        cronSchedule = `${minutes} ${hours} ${day} ${month} *`; // Run at the specified date and time
      } else {
        cronSchedule = `0 0 ${day} ${month} *`; // Run once on the specified date
      }
      break;
    case 'daily':
      // Example: task_time is '15:30'
      if (task_time) {
        const [hours, minutes] = task_time.split(':');
        cronSchedule = `${minutes} ${hours} * * *`; // Run at the specified time every day
      } else {
        cronSchedule = `0 0 * * *`; // Run once every day at midnight
      }
      break;
    case 'weekly':
      // Example: task_day_of_week is 0 (Sunday), task_time is '15:30'
      if (task_time) {
        const [hours, minutes] = task_time.split(':');
        cronSchedule = `${minutes} ${hours} * * ${task_day_of_week}`; // Run at the specified time on the specified day of the week
      } else {
        cronSchedule = `0 0 * * ${task_day_of_week}`; // Run once a week on the specified day
      }
      break;
    case 'weekdays':
      // Example: task_weekdays is '1,3,5' (Monday, Wednesday, Friday)
      console.log('task_weekdays: ', task_weekdays);
      // const weekdays = task_weekdays.split(',').map(Number); // Convert to array of integers
      // console.log('weekdays: ', weekdays);
      // const daysOfWeek = weekdays.join(',');

      // task_weekdays= [1,2,3]
      const daysOfWeek = task_weekdays.join(',');
      console.log('Daysof week: ', daysOfWeek);
      if (task_time) {
        const [hours, minutes] = task_time.split(':');
        cronSchedule = `${minutes} ${hours} * * ${daysOfWeek}`; // Run at the specified time on the specified weekdays
      } else {
        cronSchedule = `0 0 * * ${daysOfWeek}`; // Run once on the specified weekdays
      }
      break;
    case 'monthly':
      // Example: task_day_of_month is 15, task_time is '15:30'
      if (task_time) {
        const [hours, minutes] = task_time.split(':');
        cronSchedule = `${minutes} ${hours} ${task_day_of_month} * *`; // Run at the specified time on the specified day of the month
      } else {
        cronSchedule = `0 0 ${task_day_of_month} * *`; // Run once a month on the specified day
      }
      break;
    case 'yearly':
      // Example: task_month is 6 (July), task_day_of_month is 1, task_time is '15:30'
      if (task_time) {
        const [hours, minutes] = task_time.split(':');
        cronSchedule = `${minutes} ${hours} ${task_day_of_month} ${task_month} *`; // Run at the specified time on the specified date of the year
      } else {
        cronSchedule = `0 0 ${task_day_of_month} ${task_month} *`; // Run once a year on the specified date
      }
      break;
    case 'interval':
      // Example: task_interval is 15 days , task_time is '15:30'
      if (task_time) {
        const [hours, minutes] = task_time.split(':');
        const interval = task_interval;
        cronSchedule = `${minutes} ${hours} */${interval} * *`; // Run at the specified time with the specified interval
      } else {
        const interval = task_interval;
        cronSchedule = `0 0 */${interval} * *`; // Run once with the specified interval
      }
      break;

    default:
      // If task type is not 'time' or 'date', use the default cron schedule
      break;
  }

  return cronSchedule;
}

exports.runTaskCron = async (req, res) => {
  const { key } = req.body;
  console.log('req.body', req.body);
  if (key !== process.env.CRON_KEY) {
    return res.json(responser('Cron job not Executed, Key not matched'));
  }

  res.json(responser('Cron job successfully Executed.'));
};
