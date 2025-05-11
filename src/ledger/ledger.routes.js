const { requestErrorHandlingDecorator } = require('../../utils/helperFunction');
const router = require('express').Router();
const controller = require('./ledger.controller');
const Schema = require('./ledger.validation');
const checkAuth = require('../../middleware/checkAuth');

router
  .route('/upsert_ledger')
  .post(
    checkAuth,
    requestErrorHandlingDecorator(
      Schema.upsertLedgerSchema,
      controller.upsertLedger,
    ),
  );

router
  .route('/get-ledger')
  .get(
    checkAuth,
    requestErrorHandlingDecorator(Schema.getLedgerSchema, controller.getLedger),
  );
module.exports = router;
