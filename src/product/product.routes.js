const { requestErrorHandlingDecorator } = require('../../utils/helperFunction');
const router = require('express').Router();
const controller = require('./product.controller');
const Schema = require('./product.validation');
const checkAuth = require('../../middleware/checkAuth');

router
  .route('/upsert_product')
  .post(
    checkAuth,
    requestErrorHandlingDecorator(
      Schema.upsertProductSchema,
      controller.upsertProduct,
    ),
  );

router
  .route('/get-product')
  .get(
    checkAuth,
    requestErrorHandlingDecorator(
      Schema.getProductSchema,
      controller.getProduct,
    ),
  );
router
  .route('/get-stock-info')
  .get(
    checkAuth,
    requestErrorHandlingDecorator(
      Schema.getStockInfoSchema,
      controller.getStockInfo,
    ),
  );
module.exports = router;
