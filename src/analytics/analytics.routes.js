const express = require('express');

const router = express.Router();
const controller = require('./analytics.controller');
const { requestErrorHandlingDecorator } = require('../../utils/helperFunction');
const checkAuth = require('../../middleware/checkAuth');

router
  .route('/pie-chart-task-analytics')
  .get(
    checkAuth,
    requestErrorHandlingDecorator(null, controller.pieChartTaskAnalytics),
  );

module.exports = router;
