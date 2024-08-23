const { requestErrorHandlingDecorator } = require('../../utils/helperFunction');
const controller = require('./department.controller');
const router = require('express').Router();
const Schema = require('./department.validation');
const checkAuth = require('../../middleware/checkAuth');

router
  .route('/upsert-department')
  .post(
    checkAuth,
    requestErrorHandlingDecorator(
      Schema.upsertDepartmentSchema,
      controller.upsertDepartment,
    ),
  );

router
  .route('/get-department')
  .get(
    checkAuth,
    requestErrorHandlingDecorator(
      Schema.getDepartmentSchema,
      controller.getDepartment,
    ),
  );

module.exports = router;
