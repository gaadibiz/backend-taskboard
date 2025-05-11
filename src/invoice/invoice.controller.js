const { v4 } = require('uuid');

const uuid = v4;

const {
  pagination,
  filterFunctionality,
  getCountRecord,
  getRecords,
  insertRecords,
  dbRequest,
  getHighestParameterValue,
  isEditAccess,
  roleFilterService,
} = require('../../utils/dbFunctions');

const {
  responser,
  removeNullValueKey,
  convertAmountToWords,
  convertAmountToIndianStyleWords,
  setDateTimeFormat,
  throwError,
  incrementStringWithReset,
  formatIndianStyle,
  formatInternationalStyle,
  getData,
  convertISOToDate,
  convertIsoUTCToLocalDate,
} = require('../../utils/helperFunction');
const { base_url } = require('../../config/server.config');

const { ejsPreview, pdfMaker } = require('../../utils/microservice_func');
const moment = require('moment');

exports.upsertInvoices = async (req, res) => {
  await isEditAccess('latest_invoices', req.user);
  removeNullValueKey(req.body);
  let isUpadtion = false;
  let old_invoice_date;
  let highest_invoice_no = await getHighestParameterValue(
    'latest_invoices',
    'invoice_no',
    `billing_company_branch_uuid='${req.body.billing_company_branch_uuid}'`,
  );
  highest_invoice_no.highestValue = highest_invoice_no.highestValue || '0';
  const invoiceNo = incrementStringWithReset(highest_invoice_no.highestValue);
  if (req.body.invoice_uuid) {
    delete req.body.invoice_no;
    isUpadtion = true;
    let invoice_info = await getRecords(
      'latest_invoices',
      `where invoice_uuid='${req.body.invoice_uuid}'`,
    );
    if (!invoice_info.length) throwError(404, 'Invoice not found.');
    invoice_info = invoice_info[0];
    old_invoice_date = convertIsoUTCToLocalDate(invoice_info.invoice_date);
    req.body = { ...invoice_info, ...req.body };
  } else if (!req.body.invoice_uuid && req.body.invoice_no != '') {
    let invoice_info = await getRecords(
      'latest_invoices',
      `where invoice_no='${req.body.invoice_no}' ORDER BY invoice_no_aux DESC LIMIT 1`,
    );
    if (!invoice_info.length)
      throwError(404, 'Invoice not found for given invoice no.');
    invoice_info = invoice_info[0];
    invoice_info.invoice_no_aux = !invoice_info.invoice_no_aux
      ? 'A'
      : String.fromCharCode(invoice_info.invoice_no_aux.charCodeAt(0) + 1);

    // Original date and time
    let originalDate = new Date(invoice_info.create_ts);

    // Adding one minute
    originalDate.setMinutes(originalDate.getMinutes() + 1);

    // Get the updated date and time
    invoice_info.create_ts = setDateTimeFormat(
      'timestemp',
      originalDate.toISOString(),
    );
    req.body.invoice_uuid = uuid();
    req.body = { ...invoice_info, ...req.body };
  } else {
    req.body.invoice_no = invoiceNo;
    req.body.create_ts = setDateTimeFormat('timestemp');
    req.body.invoice_uuid = uuid();
  }
  await insertRecords('invoices', req.body);
  //<------------ update analytics data for updates ------------>
  if (isUpadtion) {
    if (old_invoice_date != convertISOToDate(req.body.invoice_date)) {
      console.log(
        old_invoice_date,
        '-',
        convertISOToDate(req.body.invoice_date),
      );
      await dbRequest(
        `CALL analytics_sales_invoice("${old_invoice_date}","${old_invoice_date}")`,
      );
    }
    await dbRequest(
      `CALL analytics_sales_invoice("${convertISOToDate(
        req.body.invoice_date,
      )}","${convertISOToDate(req.body.invoice_date)}")`,
    );
  }

  res.json(responser('Invoice created successfully.', req.body));
  //<------------ handle invoice approval module properly ----------->
  const bodyData = {
    table_name: 'latest_invoices',
    record_uuid: req.body.invoice_uuid,
    record_column_name: 'invoice_uuid',
  };
  getData(
    base_url + '/api/v1/approval/insert-approval',
    null,
    'json',
    bodyData,
    'POST',
    req.headers,
  );
};

exports.getInvoice = async (req, res) => {
  const {
    combined_invoice_no,
    invoice_uuid,
    pageNo,
    itemPerPage,
    from_date,
    to_date,
    status,
    cancelled_status,
    columns,
    value,
  } = req.query;
  let tableName = 'latest_invoices';
  let filter = filterFunctionality(
    {
      combined_invoice_no,
      invoice_uuid,
    },
    status,
    to_date,
    from_date,
    Array.isArray(columns) ? columns : [columns],
    value,
  );

  if (cancelled_status === 'TRUE' && status) {
    const status_array = filter.split('status=');
    filter =
      status_array[0] + "status='CANCELLED' OR status=" + status_array[1];
  }
  filter = await roleFilterService(filter, tableName, req.user);
  let pageFilter = pagination(pageNo, itemPerPage, 'create_ts');
  let totalRecords = await getCountRecord(tableName, filter);
  let result = await getRecords(tableName, filter, pageFilter);
  if (invoice_uuid) {
    const date_string = result[0].invoice_date.toISOString();
    result[0].invoice_date = date_string.split('T')[0];
  }
  return res.json(responser('Invoices ', result, result.length, totalRecords));
};

exports.upsertProformaInvoices = async (req, res) => {
  await isEditAccess('latest_proforma_invoices', req.user);
  removeNullValueKey(req.body);
  let highest_invoice_no = await getHighestParameterValue(
    'latest_proforma_invoices',
    'proforma_invoice_no',
    `billing_company_branch_uuid='${req.body.billing_company_branch_uuid}'`,
  );
  highest_invoice_no.highestValue = highest_invoice_no.highestValue || '0';
  const invoiceNo = incrementStringWithReset(highest_invoice_no.highestValue);
  let isUpadtion = false;
  let old_pi_date;
  if (req.body.proforma_invoice_uuid) {
    isUpadtion = true;
    let proforma_invoice_info = await getRecords(
      'latest_proforma_invoices',
      `where proforma_invoice_uuid='${req.body.proforma_invoice_uuid}'`,
    );
    if (!proforma_invoice_info.length)
      throwError(404, 'proforma invoice not found.');
    proforma_invoice_info = proforma_invoice_info[0];
    old_pi_date = convertIsoUTCToLocalDate(
      proforma_invoice_info.proforma_invoice_date,
    );
    req.body = { ...proforma_invoice_info, ...req.body };
  } else {
    req.body.create_ts = setDateTimeFormat('timestemp');
    req.body.proforma_invoice_uuid = v4();
    req.body.proforma_invoice_no = invoiceNo;
  }
  await insertRecords('proforma_invoice', req.body);
  //<------------ update analytics data for updates ------------>
  if (isUpadtion) {
    if (old_pi_date != convertISOToDate(req.body.proforma_invoice_date)) {
      console.log(
        old_pi_date,
        '-',
        convertISOToDate(req.body.proforma_invoice_date),
      );
      await dbRequest(
        `CALL analytics_proforma_invoice("${old_pi_date}","${old_pi_date}")`,
      );
    }
    await dbRequest(
      `CALL analytics_proforma_invoice("${convertISOToDate(
        req.body.proforma_invoice_date,
      )}","${convertISOToDate(req.body.proforma_invoice_date)}")`,
    );
  }

  res.json(
    responser('proforma invoice created or updated successfully.', req.body),
  );

  //<------------ handle proforma invoice approval module properly ----------->
  const bodyData = {
    table_name: 'latest_proforma_invoices',
    record_uuid: req.body.proforma_invoice_uuid,
    record_column_name: 'proforma_invoice_uuid',
  };
  getData(
    base_url + '/api/v1/approval/insert-approval',
    null,
    'json',
    bodyData,
    'POST',
    req.headers,
  );
};

exports.getProformaInvoice = async (req, res) => {
  const {
    combined_proforma_invoice_no,
    invoice_no,
    proforma_invoice_uuid,
    pageNo,
    itemPerPage,
    from_date,
    to_date,
    status,
    cancelled_status,
    columns,
    value,
  } = req.query;
  let tableName = 'latest_proforma_invoices';
  let filter = filterFunctionality(
    {
      combined_proforma_invoice_no,
      invoice_no,
      proforma_invoice_uuid,
    },
    status,
    to_date,
    from_date,
    Array.isArray(columns) ? columns : [columns],
    value,
  );

  if (cancelled_status === 'TRUE' && status) {
    const status_array = filter.split('status=');
    filter =
      status_array[0] + "status='CANCELLED' OR status=" + status_array[1];
  }
  filter = await roleFilterService(filter, tableName, req.user);
  let pageFilter = pagination(pageNo, itemPerPage, 'create_ts');
  let totalRecords = await getCountRecord(tableName, filter);
  let result = await getRecords(tableName, filter, pageFilter);
  if (proforma_invoice_uuid) {
    const date_string = result[0].proforma_invoice_date.toISOString();
    result[0].proforma_invoice_date = date_string.split('T')[0];
  }
  return res.json(
    responser('Proforma Invoices ', result, result.length, totalRecords),
  );
};

exports.getSingleInvoice = async (req, res) => {
  const { invoice_uuid } = req.query;
  let tableName = 'latest_invoices';

  if (!invoice_uuid) {
    return res.status(400).json(responser('Invoice_uuid is missing.'));
  }
  try {
    const invoiceResult = await getRecords(
      tableName,
      `WHERE invoice_uuid='${invoice_uuid}'`,
    );

    if (invoiceResult.length === 0) {
      return res.status(404).json(responser('Invoice not found.'));
    }

    return res.json(responser('Invoice', invoiceResult[0]));
  } catch (error) {
    return res
      .status(500)
      .json(responser('Unable to fetch the Invoice.', error));
  }
};

exports.getInvoicePreview = async (req, res) => {
  const {
    invoice_uuid,
    isPreview,
    IndianStyle,
    currency,
    conversionRate,
    isBankDetails,
  } = req.query;
  const templates = {
    TAX_INVOICE: 'invoiceTemplateWithTax.ejs',
    BILL_OF_SUPPLY: 'invoiceTemplateWithoutTax.ejs',
    SEZ_WITH_IGST: 'invoiceTemplateWithTax.ejs',
    SEZ_WITHOUT_IGST: 'invoiceTemplateWithoutTax.ejs',
    EXPORT_WITH_IGST: 'invoiceTemplateWithTax.ejs',
    EXPORT_WITHOUT_IGST: 'invoiceTemplateWithoutTax.ejs',
  };
  const headers = {
    TAX_INVOICE: 'TAX INVOICE',
    BILL_OF_SUPPLY: 'BILL OF SUPPLY',
    SEZ_WITH_IGST: 'TAX INVOICE',
    SEZ_WITHOUT_IGST: 'TAX INVOICE',
    EXPORT_WITH_IGST: 'EXPORT INVOICE',
    EXPORT_WITHOUT_IGST: 'EXPORT INVOICE',
  };
  const message = {
    TAX_INVOICE: '',
    BILL_OF_SUPPLY:
      'Declaration : Composition Taxable Person Not Eligible To Collect Taxes On Supplies',
    SEZ_WITH_IGST:
      'Supply Meant for SEZ on Payment of Integrated Tax (IGST) & claim refund',
    SEZ_WITHOUT_IGST:
      'Supply Meant for SEZ Under Bond or Letter of Undertaking without Payment of Integrated Tax (IGST)',
    EXPORT_WITH_IGST:
      'Supply Meant for Export on Payment of Integrated Tax (IGST)',
    EXPORT_WITHOUT_IGST:
      'Supply Meant for Export Under Bond or Letter of Undertaking without Payment of Integrated Tax (IGST)',
  };

  try {
    let invoiceInfo = (
      await getRecords(
        'latest_invoices',
        `where invoice_uuid='${invoice_uuid}'`,
      )
    )[0];
    const company_uuid = invoiceInfo.customer_branch_uuid;
    let contactInfo = (
      await getRecords(
        'latest_customer_branch',
        `where customer_branch_uuid='${company_uuid}'`,
      )
    )[0];
    contactInfo = contactInfo ? contactInfo : {};
    const formattedInvoiceCreateTs = moment(invoiceInfo.create_ts).format(
      'DD-MM-YYYY',
    );
    const formattedInvoiceInsertTs = moment(invoiceInfo.insert_ts).format(
      'DD-MM-YYYY',
    );
    let taxable_amount = 0,
      tax_amount = 0;
    invoiceInfo.invoice_items.forEach((element) => {
      console.log(tax_amount, 'tax amount', taxable_amount, 'taxable amount');
      tax_amount =
        tax_amount +
        Number(parseFloat(element.tax_amount * conversionRate).toFixed(2));
      taxable_amount =
        taxable_amount +
        Number(parseFloat(element.taxable_amount * conversionRate).toFixed(2));
      console.log(tax_amount, 'tax amount', taxable_amount, 'taxable amount');
      element.total = (
        IndianStyle == 'true' ? formatIndianStyle : formatInternationalStyle
      )(parseFloat(element.total * conversionRate).toFixed(2));
      element.taxable_amount = (
        IndianStyle == 'true' ? formatIndianStyle : formatInternationalStyle
      )(parseFloat(element.taxable_amount * conversionRate).toFixed(2));
      element.unit_price = (
        IndianStyle == 'true' ? formatIndianStyle : formatInternationalStyle
      )(parseFloat(element.unit_price * conversionRate).toFixed(2));
      element.tax_amount = (
        IndianStyle == 'true' ? formatIndianStyle : formatInternationalStyle
      )(parseFloat(element.tax_amount * conversionRate).toFixed(2));
      element.discount_amount = (
        IndianStyle == 'true' ? formatIndianStyle : formatInternationalStyle
      )(parseFloat(element.discount_amount * conversionRate).toFixed(2));
    });
    invoiceInfo.tax_amount = (
      IndianStyle == 'true' ? formatIndianStyle : formatInternationalStyle
    )(tax_amount.toFixed(2).toString());
    invoiceInfo.taxable_amount = (
      IndianStyle == 'true' ? formatIndianStyle : formatInternationalStyle
    )(taxable_amount.toFixed(2).toString());
    const amountInWords = (
      IndianStyle == 'true'
        ? convertAmountToIndianStyleWords
        : convertAmountToWords
    )(Math.floor(invoiceInfo.total_amount_after_tax * conversionRate));
    invoiceInfo.total_amount_after_tax = (
      IndianStyle == 'true' ? formatIndianStyle : formatInternationalStyle
    )(
      parseFloat(invoiceInfo.total_amount_after_tax * conversionRate).toFixed(
        2,
      ),
    );
    invoiceInfo.total_amount = (
      IndianStyle == 'true' ? formatIndianStyle : formatInternationalStyle
    )(parseFloat(invoiceInfo.total_amount * conversionRate).toFixed(2));

    invoiceInfo.create_ts = formattedInvoiceCreateTs;
    invoiceInfo.insert_ts = formattedInvoiceInsertTs;

    invoiceInfo.amountInWords = currency + ' ' + amountInWords;
    invoiceInfo.heading = headers[invoiceInfo.invoice_type];
    invoiceInfo.message = message[invoiceInfo.invoice_type];
    invoiceInfo.conversionRate = conversionRate;
    invoiceInfo.currency = currency;
    invoiceInfo.isBankDetails = isBankDetails;
    let branch_info = (
      await getRecords(
        'latest_customer_branch',
        `where customer_branch_uuid='${invoiceInfo.billing_company_branch_uuid}'`,
      )
    )[0];
    branch_info = branch_info ? branch_info : {};

    let bankInfo = (
      await getRecords(
        'latest_bank_details',
        `where bank_details_uuid='${invoiceInfo.advising_bank_uuid}'`,
      )
    )[0];
    bankInfo = bankInfo ? bankInfo : {};
    let exportInfo = (
      await getRecords(
        'latest_invoice_export_data',
        `where invoice_uuid='${invoiceInfo.invoice_uuid}'`,
      )
    )[0];
    exportInfo = exportInfo ? exportInfo : {};

    const responseData = {
      contactInfo,
      invoiceInfo,
      branch_info,
      bankInfo,
      exportInfo,
    };

    let result;
    if (isPreview === 'true') {
      result = await ejsPreview(
        responseData,
        templates[invoiceInfo.invoice_type],
      );
      return res.json(responser('Quote EJS', result));
    } else {
      result = await pdfMaker(
        responseData,
        templates[invoiceInfo.invoice_type],
        {
          isTitlePage: false,
        },
      );

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="invoice.pdf"',
      );
      res.send(Buffer.from(result));
    }
  } catch (error) {
    console.log(error);
  }
};

exports.getPIPreview = async (req, res) => {
  const { proforma_invoice_uuid, invoice_no, isPreview, IndianStyle } =
    req.query;
  try {
    let invoiceInfo = proforma_invoice_uuid
      ? (
          await getRecords(
            'latest_proforma_invoices',
            `where proforma_invoice_uuid='${proforma_invoice_uuid}'`,
          )
        )[0]
      : (
          await getRecords(
            'latest_proforma_invoices',
            `where invoice_no='${invoice_no}'`,
          )
        )[0];
    const company_uuid = invoiceInfo.customer_branch_uuid;
    let contactInfo = (
      await getRecords(
        'latest_customer_branch',
        `where customer_branch_uuid='${company_uuid}'`,
      )
    )[0];
    contactInfo = contactInfo ? contactInfo : {};
    const formattedInvoiceCreateTs = moment(invoiceInfo.create_ts).format(
      'DD-MM-YYYY',
    );
    const formattedInvoiceInsertTs = moment(invoiceInfo.insert_ts).format(
      'DD-MM-YYYY',
    );
    invoiceInfo.invoice_items.forEach((element) => {
      element.total = (
        IndianStyle == 'true' ? formatIndianStyle : formatInternationalStyle
      )(element.total);
      element.taxable_amount = (
        IndianStyle == 'true' ? formatIndianStyle : formatInternationalStyle
      )(element.taxable_amount);
      element.unit_price = (
        IndianStyle == 'true' ? formatIndianStyle : formatInternationalStyle
      )(element.unit_price);
      element.tax_amount = (
        IndianStyle == 'true' ? formatIndianStyle : formatInternationalStyle
      )(element.tax_amount);
    });

    const amountInWords = (
      IndianStyle == 'true'
        ? convertAmountToIndianStyleWords
        : convertAmountToWords
    )(invoiceInfo.total_amount_after_tax);
    invoiceInfo.total_amount_after_tax = (
      IndianStyle == 'true' ? formatIndianStyle : formatInternationalStyle
    )(invoiceInfo.total_amount_after_tax);
    invoiceInfo.total_amount = (
      IndianStyle == 'true' ? formatIndianStyle : formatInternationalStyle
    )(invoiceInfo.total_amount);

    invoiceInfo.create_ts = formattedInvoiceCreateTs;
    invoiceInfo.insert_ts = formattedInvoiceInsertTs;

    invoiceInfo.amountInWords = amountInWords;

    let branch_info = (
      await getRecords(
        'latest_customer_branch',
        `where customer_branch_uuid='${invoiceInfo.billing_company_branch_uuid}'`,
      )
    )[0];
    branch_info = branch_info ? branch_info : {};

    let bankInfo = (
      await getRecords(
        'latest_bank_details',
        `where bank_details_uuid='${invoiceInfo.advising_bank_uuid}'`,
      )
    )[0];
    bankInfo = bankInfo ? bankInfo : {};
    const responseData = {
      contactInfo,
      invoiceInfo,
      branch_info,
      bankInfo,
    };

    let result;
    if (isPreview === 'true') {
      result = await ejsPreview(responseData, 'pi_inventory.ejs');
      return res.json(responser('Quote EJS', result));
    } else {
      result = await pdfMaker(responseData, 'pi_inventory.ejs', {
        isTitlePage: false,
      });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="proforma_invoice.pdf"',
      );
      res.send(Buffer.from(result));
    }
  } catch (error) {
    console.log(error);
  }
};

exports.deleteInvoice = async (req, res) => {
  if (req.body.invoice_uuid) {
    let invoice_info = await getRecords(
      'latest_invoices',
      `where invoice_uuid='${req.body.invoice_uuid}'`,
    );
    if (!invoice_info.length) throwError(404, 'invoice not found.');
    invoice_info = invoice_info[0];
    invoice_info.create_ts = setDateTimeFormat(
      'timestemp',
      invoice_info.create_ts,
    );
    req.body = { ...invoice_info, ...req.body };
    req.body.status = 'DELETED';

    let ledgerData = await getRecords(
      'latest_ledger',
      `where invoice_uuid='${req.body.invoice_uuid}'`,
    );
    if (ledgerData.length) {
      for (let index = 0; index < ledgerData.length; index++) {
        const element = ledgerData[index];
        const product_balance = await getRecords(
          'latest_ledger',
          `where product_uuid="${element.product_uuid}"`,
        );
        let ledgerBodyData = {
          quantity: element.quantity,
          balance: (
            Number(product_balance[0].balance) - Number(element.quantity)
          ).toString(),
          status: 'DELETED',
        };
        ledgerBodyData = { ...element, ...ledgerBodyData };
        await insertRecords('ledgers', ledgerBodyData);
      }
    }
    await insertRecords('invoices', req.body);
  }
  return res.json(responser('Invoice Deleted Successfully :', req.body));
};

exports.upsertInvoiceExportData = async (req, res) => {
  await isEditAccess('latest_invoice_export_data', req.user);
  removeNullValueKey(req.body);
  if (req.body.invoice_export_data_uuid) {
    let invoice_export_info = await getRecords(
      'latest_invoice_export_data',
      `where invoice_export_data_uuid='${req.body.invoice_export_data_uuid}'`,
    );
    if (!invoice_export_info.length)
      throwError(404, 'proforma invoice not found.');
    invoice_export_info = invoice_export_info[0];
    req.body = { ...invoice_export_info, ...req.body };
  } else {
    req.body.create_ts = setDateTimeFormat('timestemp');
    req.body.invoice_export_data_uuid = v4();
  }
  await insertRecords('invoice_export_data', req.body);
  res.json(
    responser('Invoice Export Data created or updated successfully.', req.body),
  );

  //<------------ handle invoice export data approval module properly ----------->
  const bodyData = {
    table_name: 'latest_invoice_export_data',
    record_uuid: req.body.invoice_export_data_uuid,
    record_column_name: 'invoice_export_data_uuid',
  };
  getData(
    base_url + '/api/v1/approval/insert-approval',
    null,
    'json',
    bodyData,
    'POST',
    req.headers,
  );
};

exports.getInvoiceExportData = async (req, res) => {
  const {
    invoice_export_data_uuid,
    invoice_no,
    invoice_uuid,
    pageNo,
    itemPerPage,
    from_date,
    to_date,
    status,
    columns,
    value,
  } = req.query;
  let tableName = 'latest_invoice_export_data';
  let filter = filterFunctionality(
    {
      invoice_export_data_uuid,
      invoice_no,
      invoice_uuid,
    },
    status,
    to_date,
    from_date,
    Array.isArray(columns) ? columns : [columns],
    value,
  );
  filter = await roleFilterService(filter, tableName, req.user);
  let pageFilter = pagination(pageNo, itemPerPage, 'create_ts');
  let totalRecords = await getCountRecord(tableName, filter);
  let result = await getRecords(tableName, filter, pageFilter);
  return res.json(
    responser('Invoices export data', result, result.length, totalRecords),
  );
};

exports.getShippingEnvelopePreview = async (req, res) => {
  const { invoice_uuid, isPreview, isEnvelope } = req.query;
  const templates =
    isEnvelope === 'true' ? 'envelopeTemplate.ejs' : 'shippingTemplate.ejs';

  try {
    let invoiceInfo = (
      await getRecords(
        'latest_invoices',
        `where invoice_uuid='${invoice_uuid}'`,
      )
    )[0];
    const formattedInvoiceCreateTs = moment(invoiceInfo.create_ts).format(
      'DD-MM-YYYY',
    );

    invoiceInfo.create_ts = formattedInvoiceCreateTs;
    let branch_info = (
      await getRecords(
        'latest_customer_branch',
        `where customer_branch_uuid='${invoiceInfo.billing_company_branch_uuid}'`,
      )
    )[0];
    branch_info = branch_info ? branch_info : {};
    const responseData = {
      invoiceInfo,
      branch_info,
    };
    console.log(responseData);
    let result;
    if (isPreview === 'true') {
      result = await ejsPreview(responseData, templates);
      return res.json(responser('Shipping/Envelope EJS', result));
    } else {
      result = await pdfMaker(responseData, templates, {
        isTitlePage: false,
      });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="invoice.pdf"',
      );
      res.send(Buffer.from(result));
    }
  } catch (error) {
    console.log(error);
  }
};
