const { requestErrorHandlingDecorator } = require('../../utils/helperFunction');
const controller = require('./category.controller');
const router = require('express').Router();
const Schema = require('./category.validation');
const checkAuth = require('../../middleware/checkAuth');

router
  .route('/upsert-category')
  .post(
    checkAuth,
    requestErrorHandlingDecorator(
      Schema.upsertCategorySchema,
      controller.upsertCategory,
    ),
  );
router
  .route('/get-category')
  .get(
    checkAuth,
    requestErrorHandlingDecorator(
      Schema.getCategorySchema,
      controller.getCategory,
    ),
  );

module.exports = router;
