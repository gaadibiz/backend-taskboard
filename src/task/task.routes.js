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
  .route('/get-task-list')
  .get(
    checkAuth,
    requestErrorHandlingDecorator(
      Schema.getTaskListSchema,
      controller.getTaskList,
    ),
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
      Schema.getTaskSchema,
      controller.getTaskDefinition,
    ),
  );

module.exports = router;
