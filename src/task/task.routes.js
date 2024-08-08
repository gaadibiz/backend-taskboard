const { requestErrorHandlingDecorator } = require('../../utils/helperFunction');
const controller = require('./task.controller');
const router = require('express').Router();
const Schema = require('./task.validation');
const checkAuth = require('../../middleware/checkAuth');

router
  .route('/upsert-task')
  .post(
    checkAuth,
    requestErrorHandlingDecorator(
      Schema.upsertTaskSchema,
      controller.upsertTask,
    ),
  );
router
  .route('/get-task')
  .get(
    checkAuth,
    requestErrorHandlingDecorator(Schema.getTaskSchema, controller.getTask),
  );
router
  .route('/get-task-count')
  .get(
    checkAuth,
    requestErrorHandlingDecorator(
      Schema.getTaskCountSchema,
      controller.getTaskCount,
    ),
  );
router
  .route('/get-task-list')
  .get(
    checkAuth,
    requestErrorHandlingDecorator(
      Schema.getTaskListSchema,
      controller.getTaskList,
    ),
  );

router
  .route('/get-task-calender')
  .get(
    checkAuth,
    requestErrorHandlingDecorator(null, controller.getTaskCalender),
  );

router
  .route('/upsert-task-definition')
  .post(
    checkAuth,
    requestErrorHandlingDecorator(
      Schema.upsertTaskDefinitionSchema,
      controller.upsertTaskDefinition,
    ),
  );
router
  .route('/get-task-definition')
  .get(
    checkAuth,
    requestErrorHandlingDecorator(
      Schema.getTaskDefinitionSchema,
      controller.getTaskDefinition,
    ),
  );

module.exports = router;
