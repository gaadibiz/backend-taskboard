const { v4 } = require('uuid');
const {
  pagination,
  filterFunctionality,
  getCountRecord,
  getRecords,
  insertRecords,
  getHighestParameterValue,
  isEditAccess,
  roleFilterService,
  dbRequest,
} = require('../../utils/dbFunctions');
const moment = require('moment');

const {
  responser,
  removeNullValueKey,
  setDateTimeFormat,
  throwError,
  incrementStringWithReset,
  getData,
  formatIndianStyle,
  formatInternationalStyle,
  convertAmountToWords,
  convertAmountToIndianStyleWords,
  convertIsoUTCToLocalDate,
  convertISOToDate,
} = require('../../utils/helperFunction');
const { ejsPreview, pdfMaker } = require('../../utils/microservice_func');

const { base_url } = require('../../config/server.config');

exports.upsertPurchaseOrder = async (req, res) => {
  await isEditAccess('latest_purchase_order', req.user);
  removeNullValueKey(req.body);
  let isUpadtion = false;
  let old_purchase_order_date;
  let highest_purchase_order_no = await getHighestParameterValue(
    'latest_purchase_order',
    'purchase_order_no',
    `billing_company_branch_uuid='${req.body.billing_company_branch_uuid}'`,
  );
  highest_purchase_order_no.highestValue =
    highest_purchase_order_no.highestValue || '0';
  const purchase_order_no = incrementStringWithReset(
    highest_purchase_order_no.highestValue,
  );
  if (req.body.purchase_order_uuid) {
    isUpadtion = true;
    let purchase_order_info = await getRecords(
      'latest_purchase_order',
      `where purchase_order_uuid='${req.body.purchase_order_uuid}'`,
    );
    if (!purchase_order_info.length)
      throwError(404, 'Purchase Order not found.');
    purchase_order_info = purchase_order_info[0];
    purchase_order_info.create_ts = setDateTimeFormat(
      'timestemp',
      purchase_order_info.create_ts,
    );
    old_purchase_order_date = convertIsoUTCToLocalDate(
      purchase_order_info.purchase_order_date,
    );
    req.body = { ...purchase_order_info, ...req.body };
  } else {
    req.body.purchase_order_no = purchase_order_no;
    req.body.create_ts = setDateTimeFormat('timestemp');
    req.body.purchase_order_uuid = v4();
  }

  req.body.purchase_order_date = convertISOToDate(req.body.purchase_order_date);

  await insertRecords('purchase_order', req.body);

  //<------------ update analytics data for updates ------------>
  // if (isUpadtion) {
  //   if (
  //     old_purchase_order_date != convertISOToDate(req.body.purchase_order_date)
  //   ) {
  //     console.log(
  //       old_purchase_order_date,
  //       '-',
  //       convertISOToDate(req.body.purchase_order_date),
  //     );
  //     await dbRequest(
  //       `CALL analytics_purchase_order("${old_purchase_order_date}","${old_purchase_order_date}")`,
  //     );
  //   }
  //   await dbRequest(
  //     `CALL analytics_purchase_order("${convertISOToDate(
  //       req.body.purchase_order_date,
  //     )}","${convertISOToDate(req.body.purchase_order_date)}")`,
  //   );
  // }

  res.json(responser('Purchase Order created successfully.', req.body));

  //<------------ handle quotation approval module properly ----------->
  const bodyData = {
    table_name: 'latest_purchase_order',
    record_uuid: req.body.purchase_order_uuid,
    record_column_name: 'purchase_order_uuid',
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

exports.getPurchaseOrder = async (req, res) => {
  const {
    combined_purchase_order_no,
    purchase_order_uuid,
    pageNo,
    itemPerPage,
    from_date,
    to_date,
    status,
    cancelled_status,
    columns,
    value,
  } = req.query;
  let tableName = 'latest_purchase_order';
  let filter = filterFunctionality(
    {
      combined_purchase_order_no,
      purchase_order_uuid,
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
  if (purchase_order_uuid) {
    // const date_string = result[0].purchase_order_date.toISOString();
    // result[0].purchase_order_date = date_string.split('T')[0];
  }

  if (result.length > 0) {
    // // merge approval record logic
    mergeExpense = await getData(
      base_url + '/api/v1/approval/merge-approval-record',
      null,
      'json',
      {
        record_uuid: result[0].purchase_order_uuid,
        table_name: tableName,
        data: {},
      },
      'POST',
      req.headers,
    );

    // console.log(mergeExpense);

    // Update the first order with response data
    if (mergeExpense) {
      const { approval_uuid, requested_by_uuid, is_user_approver } =
        mergeExpense; // Destructure for direct assignments
      Object.assign(result[0], {
        approval_uuid,
        requested_by_uuid,
        is_user_approver,
      });
    }
  }

  return res.json(
    responser('Purchase Order : ', result, result.length, totalRecords),
  );
};

exports.getPOPreview = async (req, res) => {
  const { purchase_order_uuid, isPreview, IndianStyle } = req.query;

  let invoiceInfo = (
    await getRecords(
      'latest_purchase_order',
      `where purchase_order_uuid='${purchase_order_uuid}'`,
    )
  )[0];
  const company_uuid = invoiceInfo.vendor_uuid;
  let contactInfo = (
    await getRecords('latest_vendors', `where vendor_uuid='${company_uuid}'`)
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

  // let branch_info = (
  //   await getRecords(
  //     'latest_customer_branch',
  //     `where customer_branch_uuid='${invoiceInfo.billing_company_branch_uuid}'`,
  //   )
  // )[0];
  // branch_info = branch_info ? branch_info : {};

  const responseData = {
    contactInfo,
    invoiceInfo,
    // branch_info
  };

  let result;

  console.log('response Data' + JSON.stringify(responseData));

  if (isPreview === 'true') {
    result = await ejsPreview(responseData, 'pdf/po_task_and_expense.ejs');
    return res.json(responser('PO EJS', result));
  } else {
    result = await pdfMaker(responseData, 'po_task_and_expense.ejs', {
      isTitlePage: false,
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="proforma_invoice.pdf"',
    );
    res.send(Buffer.from(result));
  }
};
