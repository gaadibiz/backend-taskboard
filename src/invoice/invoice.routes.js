const { requestErrorHandlingDecorator } = require('../../utils/helperFunction');
const controller = require('./invoice.controller');
const router = require('express').Router();
const checkAuth = require('../../middleware/checkAuth');
const Schema = require('./invoice.validation');

router
  .route('/upsert-invoice')
  .post(
    checkAuth,
    requestErrorHandlingDecorator(
      Schema.upsertInvoiceSchema,
      controller.upsertInvoices,
    ),
  );

router
  .route('/get-invoice')
  .get(
    checkAuth,
    requestErrorHandlingDecorator(
      Schema.getInvoiceSchema,
      controller.getInvoice,
    ),
  );

router
  .route('/upsert-proforma-invoice')
  .post(
    checkAuth,
    requestErrorHandlingDecorator(
      Schema.upsertProformaInvoiceSchema,
      controller.upsertProformaInvoices,
    ),
  );

router
  .route('/get-proforma-invoice')
  .get(
    checkAuth,
    requestErrorHandlingDecorator(
      Schema.getProformaInvoiceSchema,
      controller.getProformaInvoice,
    ),
  );

router
  .route('/get-single-invoice')
  .get(
    requestErrorHandlingDecorator(
      Schema.getSingleInvoiceSchema,
      controller.getSingleInvoice,
    ),
  );
router
  .route('/get-invoice-preview')
  .get(
    requestErrorHandlingDecorator(
      Schema.getInvoicePreview,
      controller.getInvoicePreview,
    ),
  );

router
  .route('/get-pi-preview')
  .get(
    requestErrorHandlingDecorator(Schema.getPIPreview, controller.getPIPreview),
  );

router
  .route('/upsert-invoice-export-data')
  .post(
    checkAuth,
    requestErrorHandlingDecorator(
      Schema.upsertInvoiceExportDataSchema,
      controller.upsertInvoiceExportData,
    ),
  );

router
  .route('/get-invoice-export-data')
  .get(
    checkAuth,
    requestErrorHandlingDecorator(
      Schema.getInvoiceExportDataSchema,
      controller.getInvoiceExportData,
    ),
  );

router
  .route('/get-shipping-envelope-preview')
  .get(
    requestErrorHandlingDecorator(
      Schema.getShippingEnvelopePreviewSchema,
      controller.getShippingEnvelopePreview,
    ),
  );
module.exports = router;
