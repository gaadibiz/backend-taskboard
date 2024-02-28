const { requestErrorHandlingDecorator } = require('../../utils/helperFunction');
const controller = require('./project.controller');
const router = require('express').Router();
const Schema = require('./project.validation');
const checkAuth = require('../../middleware/checkAuth');

router
  .route('/upsert-project')
  .post(
    checkAuth,
    requestErrorHandlingDecorator(
      Schema.upsertProjectSchema,
      controller.upsertProject,
    ),
  );

router
  .route('/get-project')
  .get(
    checkAuth,
    requestErrorHandlingDecorator(
      Schema.getProjectSchema,
      controller.getProject,
    ),
  );

module.exports = router;
