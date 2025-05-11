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
} = require('../../utils/helperFunction');

const { base_url } = require('../../config/server.config');
const { v4 } = require('uuid');
const { ejsPreview, pdfMaker } = require('../../utils/microservice_func');
const moment = require('moment');

exports.upsertDeliveryChallan = async (req, res) => {
  await isEditAccess('latest_delivery_challan', req.user);
  removeNullValueKey(req.body);
  let isUpadtion = false;
  let highest_delivery_challan_no = await getHighestParameterValue(
    'latest_delivery_challan',
    'delivery_challan_no',
    `billing_company_branch_uuid='${req.body.billing_company_branch_uuid}'`,
  );
  highest_delivery_challan_no.highestValue =
    highest_delivery_challan_no.highestValue || '0';
  const dc_no = incrementStringWithReset(
    highest_delivery_challan_no.highestValue,
  );
  if (req.body.delivery_challan_uuid) {
    isUpadtion = true;
    let delivery_challan_info = await getRecords(
      'latest_delivery_challan',
      `where delivery_challan_uuid='${req.body.delivery_challan_uuid}'`,
    );
    if (!delivery_challan_info.length)
      throwError(404, 'Delivery Challan not found.');
    delivery_challan_info = delivery_challan_info[0];
    delivery_challan_info.create_ts = setDateTimeFormat(
      'timestemp',
      delivery_challan_info.create_ts,
    );
    req.body = { ...delivery_challan_info, ...req.body };
  } else {
    req.body.delivery_challan_no = dc_no;
    req.body.create_ts = setDateTimeFormat('timestemp');
    req.body.delivery_challan_uuid = v4();
  }
  await insertRecords('delivery_challan', req.body);
  //Updating in the ledger table simulataneously
  for (const invoice_element of req.body.invoice_items) {
    if (invoice_element.product_uuid || !invoice_element.product_uuid == '') {
      dbRequest(`
        CALL proc_insert_ledger('${req.body.delivery_challan_uuid}',
                                '${invoice_element.product_uuid}',
                                 ${invoice_element.quantity},
                                '${req.body.billing_company_uuid}',
                                '${req.body.customer_name}',
                                'OUT','')`);
    }
  }
  res.json(responser('Delivery Challan created successfully.', req.body));

  //<------------ handle delivery challan approval module properly ----------->
  const bodyData = {
    table_name: 'latest_delivery_challan',
    record_uuid: req.body.delivery_challan_uuid,
    record_column_name: 'delivery_challan_uuid',
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

exports.getDeliveryChallan = async (req, res) => {
  const {
    combined_delivery_challan_no,
    delivery_challan_uuid,
    billing_company_uuid,
    pageNo,
    itemPerPage,
    from_date,
    to_date,
    status,
    cancelled_status,
    columns,
    value,
  } = req.query;
  let tableName = 'latest_delivery_challan';
  let filter = filterFunctionality(
    {
      combined_delivery_challan_no,
      delivery_challan_uuid,
      billing_company_uuid,
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
  if (delivery_challan_uuid) {
    const date_string = result[0].date.toISOString();
    result[0].date = date_string.split('T')[0];
  }

  if (result.length) {
    const updatedResult = await Promise.all(
      result.map(async (element) => {
        const sales_invoice_no = await getRecords(
          'latest_invoices',
          `where delivery_challan_uuid='${element.delivery_challan_uuid}'`,
        );
        element.sales_invoice_no = sales_invoice_no.length
          ? sales_invoice_no[0].combined_invoice_no
          : 'PENDING';
        return element;
      }),
    );

    result = updatedResult; // Only if you need to update the original `result` array.
  }
  return res.json(
    responser('Delivery Challan ', result, result.length, totalRecords),
  );
};

exports.getDeliveryChallanPreview = async (req, res) => {
  const { delivery_challan_uuid, isPreview, IndianStyle } = req.query;
  try {
    let deliveryChallanInfo = (
      await getRecords(
        'latest_delivery_challan',
        `where delivery_challan_uuid='${delivery_challan_uuid}'`,
      )
    )[0];
    const company_uuid = deliveryChallanInfo.customer_branch_uuid;
    let contactInfo = (
      await getRecords(
        'latest_customer_branch',
        `where customer_branch_uuid='${company_uuid}'`,
      )
    )[0];
    contactInfo = contactInfo ? contactInfo : {};
    const formattedInvoiceDate = moment(
      deliveryChallanInfo.invoice_date,
    ).format('DD-MM-YYYY');
    const formattedInvoiceCreateTs = moment(
      deliveryChallanInfo.create_ts,
    ).format('DD-MM-YYYY');
    const formattedInvoiceInsertTs = moment(
      deliveryChallanInfo.insert_ts,
    ).format('DD-MM-YYYY');
    deliveryChallanInfo.invoice_items.forEach((element) => {
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
    )(deliveryChallanInfo.total_amount);
    deliveryChallanInfo.total_amount = (
      IndianStyle == 'true' ? formatIndianStyle : formatInternationalStyle
    )(deliveryChallanInfo.total_amount);

    deliveryChallanInfo.invoice_date = formattedInvoiceDate;
    deliveryChallanInfo.create_ts = formattedInvoiceCreateTs;
    deliveryChallanInfo.insert_ts = formattedInvoiceInsertTs;

    deliveryChallanInfo.amountInWords = amountInWords;

    let branch_info = (
      await getRecords(
        'latest_customer_branch',
        `where customer_branch_uuid='${deliveryChallanInfo.billing_company_branch_uuid}'`,
      )
    )[0];
    branch_info = branch_info ? branch_info : {};

    let bankInfo = (
      await getRecords(
        'latest_bank_details',
        `where customer_uuid='${deliveryChallanInfo.billing_company_uuid}'`,
      )
    )[0];
    bankInfo = bankInfo ? bankInfo : {};

    const responseData = {
      contactInfo,
      deliveryChallanInfo,
      branch_info,
      bankInfo,
    };
    console.log(responseData);
    let result;
    if (isPreview === 'true') {
      result = await ejsPreview(responseData, 'deliveryChallanTemplate.ejs');
      return res.json(responser('Delivery Challan EJS', result));
    } else {
      result = await pdfMaker(responseData, 'deliveryChallanTemplate.ejs', {
        isTitlePage: false,
      });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="DC.pdf"');
      res.send(Buffer.from(result));
    }
  } catch (error) {
    console.log(error);
  }
};
