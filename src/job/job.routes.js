const { requestErrorHandlingDecorator } = require('../../utils/helperFunction');
const controller = require('./job.controller');
const router = require('express').Router();
const checkAuth = require('../../middleware/checkAuth');
const Schema = require('./job.validation');

router
  .route('/upsert-job')
  .post(
    checkAuth,
    requestErrorHandlingDecorator(Schema.upsertJobSchema, controller.upsertJob),
  );

router
  .route('/get-job')
  .get(
    checkAuth,
    requestErrorHandlingDecorator(Schema.getJobSchema, controller.getJob),
  );
module.exports = router;
