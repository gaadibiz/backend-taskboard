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
const { v4 } = require('uuid');
const { ejsPreview, pdfMaker } = require('../../utils/microservice_func');
const moment = require('moment');
const { base_url } = require('../../config/server.config');

exports.upsertCreditDebitNote = async (req, res) => {
  await isEditAccess('latest_credit_debit_note', req.user);
  removeNullValueKey(req.body);
  let isUpadtion = false;
  let old_cdn_date;
  let highest_credit_debit_note_no = await getHighestParameterValue(
    'latest_credit_debit_note',
    'credit_debit_note_no',
    `credit_debit_note_type='${req.body.credit_debit_note_type}'`,
  );
  highest_credit_debit_note_no.highestValue =
    highest_credit_debit_note_no.highestValue || '0';
  const CDNNo = incrementStringWithReset(
    highest_credit_debit_note_no.highestValue,
  );
  if (req.body.credit_debit_note_uuid) {
    isUpadtion = true;
    let credit_debit_note_info = await getRecords(
      'latest_credit_debit_note',
      `where credit_debit_note_uuid='${req.body.credit_debit_note_uuid}'`,
    );
    if (!credit_debit_note_info.length)
      throwError(404, 'credit_debit_note not found.');
    credit_debit_note_info = credit_debit_note_info[0];
    credit_debit_note_info.create_ts = setDateTimeFormat(
      'timestemp',
      credit_debit_note_info.create_ts,
    );
    old_cdn_date = convertIsoUTCToLocalDate(
      credit_debit_note_info.credit_debit_note_date,
    );
    req.body = { ...credit_debit_note_info, ...req.body };
  } else {
    req.body.credit_debit_note_no = CDNNo;
    req.body.create_ts = setDateTimeFormat('timestemp');
    req.body.credit_debit_note_uuid = v4();
  }
  await insertRecords('credit_debit_note', req.body);

  //<------------ update analytics data for updates ------------>
  if (isUpadtion) {
    if (old_cdn_date != convertISOToDate(req.body.credit_debit_note_date)) {
      console.log(
        old_cdn_date,
        '-',
        convertISOToDate(req.body.credit_debit_note_date),
      );
      await dbRequest(
        `CALL analytics_credit_debit_note("${old_cdn_date}","${old_cdn_date}"`,
      );
    }
    await dbRequest(
      `CALL analytics_credit_debit_note("${convertISOToDate(
        req.body.credit_debit_note_date,
      )}","${convertISOToDate(req.body.credit_debit_note_date)}")`,
    );
  }

  //<------------ update ledger data for updates ------------>
  // const type = req.body.credit_debit_note_type === 'CREDIT' ? 'IN' : 'OUT';
  // //Updating in the ledger table simulataneously
  // for (const invoice_element of req.body.invoice_items) {
  //   if (invoice_element.product_uuid || !invoice_element.product_uuid == '') {
  //     dbRequest(`
  //     CALL proc_insert_ledger('${req.body.credit_debit_note_uuid}',
  //                             '${invoice_element.product_uuid}',
  //                              ${invoice_element.quantity},
  //                             '${req.body.billing_company_uuid}',
  //                             '${req.body.customer_name}',
  //                             '${type}',
  //                             'credit_debit_note')`);
  //   }
  // }
  res.json(responser('credit_debit_note created successfully.', req.body));

  //<------------ handle credit debit note approval module properly ----------->
  const bodyData = {
    table_name: 'latest_credit_debit_note',
    record_uuid: req.body.credit_debit_note_uuid,
    record_column_name: 'credit_debit_note_uuid',
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

exports.getCreditDebitNote = async (req, res) => {
  const {
    credit_debit_note_uuid,
    pageNo,
    itemPerPage,
    from_date,
    to_date,
    status,
    cancelled_status,
    columns,
    value,
  } = req.query;
  let tableName = 'latest_credit_debit_note';
  let filter = filterFunctionality(
    {
      credit_debit_note_uuid,
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
  let pageFilter = pagination(pageNo, itemPerPage);
  let totalRecords = await getCountRecord(tableName, filter);
  let result = await getRecords(tableName, filter, pageFilter);
  if (credit_debit_note_uuid) {
    const date_string = result[0].credit_debit_note_date.toISOString();
    result[0].credit_debit_note_date = date_string.split('T')[0];
  }
  return res.json(
    responser('credit_debit_note ', result, result.length, totalRecords),
  );
};

exports.upsertDebitNote = async (req, res) => {
  await isEditAccess('latest_debit_note', req.user);
  removeNullValueKey(req.body);
  let isUpadtion = false;
  let highest_debit_note_no = await getHighestParameterValue(
    'latest_debit_note',
    'debit_note_no',
    `billing_company_branch_uuid='${req.body.billing_company_branch_uuid}'`,
  );
  highest_debit_note_no.highestValue =
    highest_debit_note_no.highestValue || '0';
  const DNNo = incrementStringWithReset(highest_debit_note_no.highestValue);
  if (req.body.debit_note_uuid) {
    isUpadtion = true;
    let debit_note_info = await getRecords(
      'latest_debit_note',
      `where debit_note_uuid='${req.body.debit_note_uuid}'`,
    );
    if (!debit_note_info.length) throwError(404, 'Debit Note not found.');
    debit_note_info = debit_note_info[0];
    debit_note_info.create_ts = setDateTimeFormat(
      'timestemp',
      debit_note_info.create_ts,
    );
    req.body = { ...debit_note_info, ...req.body };
  } else {
    req.body.debit_note_no = DNNo;
    req.body.create_ts = setDateTimeFormat('timestemp');
    req.body.debit_note_uuid = v4();
  }
  await insertRecords('debit_note', req.body);

  //<------------ update ledger data for updates ------------>
  //Updating in the ledger table simulataneously
  // for (const invoice_element of req.body.invoice_items) {
  //   if (invoice_element.product_uuid || !invoice_element.product_uuid == '') {
  //     dbRequest(`
  //     CALL proc_insert_ledger('${req.body.debit_note_uuid}',
  //                             '${invoice_element.product_uuid}',
  //                              ${invoice_element.quantity},
  //                             '${req.body.billing_company_uuid}',
  //                             '${req.body.customer_name}',
  //                             'OUT',
  //                             'debit_note')`);
  //   }
  // }
  res.json(responser('Debit Note created successfully.', req.body));

  //<------------ handle credit debit note approval module properly ----------->
  const bodyData = {
    table_name: 'latest_debit_note',
    record_uuid: req.body.debit_note_uuid,
    record_column_name: 'debit_note_uuid',
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

exports.getDebitNote = async (req, res) => {
  const {
    debit_note_uuid,
    pageNo,
    itemPerPage,
    from_date,
    to_date,
    status,
    cancelled_status,
    columns,
    value,
  } = req.query;
  let tableName = 'latest_debit_note';
  let filter = filterFunctionality(
    {
      debit_note_uuid,
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
  let pageFilter = pagination(pageNo, itemPerPage);
  let totalRecords = await getCountRecord(tableName, filter);
  let result = await getRecords(tableName, filter, pageFilter);
  if (debit_note_uuid) {
    const date_string = result[0].debit_note_date.toISOString();
    result[0].debit_note_date = date_string.split('T')[0];
  }
  return res.json(
    responser('Debit Note ', result, result.length, totalRecords),
  );
};

exports.getCDNPreview = async (req, res) => {
  const { credit_debit_note_uuid, isPreview, IndianStyle } = req.query;
  try {
    let invoiceInfo = (
      await getRecords(
        'latest_credit_debit_note',
        `where credit_debit_note_uuid='${credit_debit_note_uuid}'`,
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
    const formattedInvoiceDate = moment(invoiceInfo.invoice_date).format(
      'DD-MM-YYYY',
    );
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
    )(invoiceInfo.total_value);
    invoiceInfo.total_value = (
      IndianStyle == 'true' ? formatIndianStyle : formatInternationalStyle
    )(invoiceInfo.total_value);

    invoiceInfo.invoice_date = formattedInvoiceDate;
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

    const responseData = {
      contactInfo,
      invoiceInfo,
      branch_info,
    };
    let result;
    if (isPreview === 'true') {
      result = await ejsPreview(responseData, 'creditNote.ejs');
      return res.json(responser('Quote EJS', result));
    } else {
      result = await pdfMaker(responseData, 'creditNote.ejs', {
        isTitlePage: false,
      });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="Credit Note.pdf"',
      );
      res.send(Buffer.from(result));
    }
  } catch (error) {
    console.log(error);
  }
};

exports.getDebitNotePreview = async (req, res) => {
  const { debit_note_uuid, isPreview, IndianStyle } = req.query;
  try {
    let invoiceInfo = (
      await getRecords(
        'latest_debit_note',
        `where debit_note_uuid='${debit_note_uuid}'`,
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
    const formattedInvoiceDate = moment(invoiceInfo.invoice_date).format(
      'DD-MM-YYYY',
    );
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
    )(invoiceInfo.total_value);
    invoiceInfo.total_value = (
      IndianStyle == 'true' ? formatIndianStyle : formatInternationalStyle
    )(invoiceInfo.total_value);

    invoiceInfo.invoice_date = formattedInvoiceDate;
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

    const responseData = {
      contactInfo,
      invoiceInfo,
      branch_info,
    };
    let result;
    if (isPreview === 'true') {
      result = await ejsPreview(responseData, 'debitNote.ejs');
      return res.json(responser('Debit Note EJS', result));
    } else {
      result = await pdfMaker(responseData, 'debitNote.ejs', {
        isTitlePage: false,
      });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="Debit Note.pdf"',
      );
      res.send(Buffer.from(result));
    }
  } catch (error) {
    console.log(error);
  }
};
