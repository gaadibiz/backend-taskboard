const { requestErrorHandlingDecorator } = require('../../utils/helperFunction');
const controller = require('./sale_order.controller');
const router = require('express').Router();
const checkAuth = require('../../middleware/checkAuth');
const Schema = require('./sale_order.validation');

router
  .route('/upsert-sale-order')
  .post(
    checkAuth,
    requestErrorHandlingDecorator(
      Schema.upsertSaleOrderSchema,
      controller.upsertSaleOrder,
    ),
  );

router
  .route('/get-sale-order')
  .get(
    checkAuth,
    requestErrorHandlingDecorator(
      Schema.getSaleOrderSchema,
      controller.getSaleOrder,
    ),
  );
module.exports = router;
