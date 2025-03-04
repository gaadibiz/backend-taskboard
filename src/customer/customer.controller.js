const {
  pagination,
  filterFunctionality,
  getCountRecord,
  getRecords,
  insertRecords,
  dbRequest,
  isValidRecord,
  isEditAccess,
  roleFilterService,
} = require('../../utils/dbFunctions');

const {
  responser,
  removeNullValueKey,
  setDateTimeFormat,
  throwError,
  getData,
} = require('../../utils/helperFunction');
const { v4 } = require('uuid');
const { base_url } = require('../../config/server.config');

exports.upsertCustomer = async (req, res) => {
  await isEditAccess('latest_customer', req.user);
  removeNullValueKey(req.body);
  let isUpadtion = false;
  if (req.body.customer_uuid) {
    isUpadtion = true;
    let customer_info = await getRecords(
      'latest_customer',
      `where customer_uuid='${req.body.customer_uuid}'`,
    );
    if (!customer_info.length) throwError(404, 'Customer not found.');
    customer_info = customer_info[0];
    customer_info.create_ts = setDateTimeFormat(
      'timestemp',
      customer_info.create_ts,
    );
    req.body = { ...customer_info, ...req.body };
  } else {
    req.body.create_ts = setDateTimeFormat('timestemp');
    req.body.customer_uuid = v4();
  }
  await insertRecords('customer', req.body);
  res.json(responser('customer created successfully.', req.body));

  //<------------ handle customer approval module properly ----------->
  const bodyData = {
    table_name: 'latest_customer',
    record_uuid: req.body.customer_uuid,
    record_column_name: 'customer_uuid',
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

exports.getCustomer = async (req, res) => {
  const {
    customer_uuid,
    is_billing_company,
    pageNo,
    itemPerPage,
    from_date,
    to_date,
    status,
    columns,
    value,
  } = req.query;
  let tableName = 'latest_customer';
  let filter = filterFunctionality(
    {
      customer_uuid,
      is_billing_company,
    },
    status,
    to_date,
    from_date,
    Array.isArray(columns) ? columns : [columns],
    value,
  );
  filter = await roleFilterService(filter, tableName, req.user);
  let pageFilter = pagination(pageNo, itemPerPage);
  let totalRecords = await getCountRecord(tableName, filter);
  let result = await getRecords(tableName, filter, pageFilter);
  let customer_branch_data;
  if (customer_uuid) {
    customer_branch_data = await getRecords(
      'latest_customer_branch',
      `where customer_uuid="${customer_uuid}"`,
    );
    customer_branch_data = customer_branch_data[0];
    result = [...result, customer_branch_data];
  }
  return res.json(responser('Customer ', result, result.length, totalRecords));
};

exports.upsertCustomerBranch = async (req, res) => {
  await isEditAccess('latest_customer_branch', req.user);
  removeNullValueKey(req.body);
  if (req.body.customer_branch_uuid) {
    let customer_branch_info = await getRecords(
      'latest_customer_branch',
      `where customer_branch_uuid='${req.body.customer_branch_uuid}'`,
    );
    if (!customer_branch_info.length)
      throwError(404, 'Customer Branch not found.');
    customer_branch_info = customer_branch_info[0];
    customer_branch_info.create_ts = setDateTimeFormat(
      'timestemp',
      customer_branch_info.create_ts,
    );
    req.body = { ...customer_branch_info, ...req.body };
  } else {
    req.body.create_ts = setDateTimeFormat('timestemp');
    req.body.customer_branch_uuid = v4();
  }
  await insertRecords('customer_branch', req.body);
  res.json(
    responser('Customer Branch created or updated successfully.', req.body),
  );

  //<------------ handle customer branch approval module properly ----------->
  const bodyData = {
    table_name: 'latest_customer_branch',
    record_uuid: req.body.customer_branch_uuid,
    record_column_name: 'customer_branch_uuid',
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

exports.getCustomerBranch = async (req, res) => {
  const {
    customer_branch_uuid,
    customer_uuid,
    pageNo,
    itemPerPage,
    from_date,
    to_date,
    status,
    columns,
    value,
  } = req.query;

  let tableName = 'latest_customer_branch'; // Adjust the table name based on your naming conventions
  let filter = filterFunctionality(
    {
      customer_branch_uuid,
      customer_uuid,
    },
    status,
    to_date,
    from_date,
    Array.isArray(columns) ? columns : [columns],
    value,
  );

  // Apply additional filters or services if needed
  filter = await roleFilterService(filter, tableName, req.user);
  let pageFilter = pagination(pageNo, itemPerPage);
  let totalRecords = await getCountRecord(tableName, filter);
  let result = await getRecords(tableName, filter, pageFilter);

  return res.json(
    responser('All Customer Branch', result, result.length, totalRecords),
  );
};

exports.upsertCustomerDeliveryAddress = async (req, res) => {
  await isEditAccess('latest_customer_delivery_address', req.user);
  removeNullValueKey(req.body);
  if (req.body.customer_delivery_address_uuid) {
    let customer_delivery_address_info = await getRecords(
      'latest_customer_delivery_address',
      `where customer_delivery_address_uuid='${req.body.customer_delivery_address_uuid}'`,
    );
    if (!customer_delivery_address_info.length)
      throwError(404, 'customer delivery address not found.');
    customer_delivery_address_info = customer_delivery_address_info[0];
    customer_delivery_address_info.create_ts = setDateTimeFormat(
      'timestemp',
      customer_delivery_address_info.create_ts,
    );
    req.body = { ...customer_delivery_address_info, ...req.body };
  } else {
    req.body.create_ts = setDateTimeFormat('timestemp');
    req.body.customer_delivery_address_uuid = v4();
  }
  await insertRecords('customer_delivery_address', req.body);
  res.json(
    responser(
      'Customer Delivery Address created or updated successfully.',
      req.body,
    ),
  );

  //<------------ handle customer delivery address approval module properly ----------->
  const bodyData = {
    table_name: 'latest_customer_delivery_address',
    record_uuid: req.body.customer_delivery_address_uuid,
    record_column_name: 'customer_delivery_address_uuid',
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

exports.getCustomerDeliveryAddress = async (req, res) => {
  const {
    customer_delivery_address_uuid,
    customer_uuid,
    customer_name,
    pageNo,
    itemPerPage,
    from_date,
    to_date,
    status,
    columns,
    value,
  } = req.query;

  let tableName = 'latest_customer_delivery_address'; // Adjust the table name based on your naming conventions
  let filter = filterFunctionality(
    {
      customer_delivery_address_uuid,
      customer_uuid,
      customer_name,
    },
    status,
    to_date,
    from_date,
    Array.isArray(columns) ? columns : [columns],
    value,
  );

  // Apply additional filters or services if needed
  filter = await roleFilterService(filter, tableName, req.user);
  let pageFilter = pagination(pageNo, itemPerPage);
  let totalRecords = await getCountRecord(tableName, filter);
  let result = await getRecords(tableName, filter, pageFilter);

  return res.json(
    responser(
      'All Customer Delivery Addresses',
      result,
      result.length,
      totalRecords,
    ),
  );
};

exports.upsertBillingDispatchAddress = async (req, res) => {
  await isEditAccess('latest_customer_delivery_address', req.user);
  removeNullValueKey(req.body);
  console.log(req.body, 'req.body');
  if (req.body.customer_dispatch_address_uuid) {
    let customer_dispatch_address_info = await getRecords(
      'latest_customer_dispatch_address',
      `where customer_dispatch_address_uuid='${req.body.customer_dispatch_address_uuid}'`,
    );
    if (!customer_dispatch_address_info.length)
      throwError(404, 'customer delivery address not found.');
    customer_dispatch_address_info = customer_dispatch_address_info[0];
    customer_dispatch_address_info.create_ts = setDateTimeFormat(
      'timestemp',
      customer_dispatch_address_info.create_ts,
    );
    req.body = { ...customer_dispatch_address_info, ...req.body };
  } else {
    req.body.create_ts = setDateTimeFormat('timestemp');
    req.body.customer_dispatch_address_uuid = v4();
  }
  await insertRecords('customer_dispatch_address', req.body);
  res.json(
    responser(
      'Customer Dispatch Address created or updated successfully.',
      req.body,
    ),
  );

  //<------------ handle customer dispatch address approval module properly ----------->
  const bodyData = {
    table_name: 'latest_customer_dispatch_address',
    record_uuid: req.body.customer_dispatch_address_uuid,
    record_column_name: 'customer_dispatch_address_uuid',
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

exports.getBillingDispatchAddress = async (req, res) => {
  const {
    customer_dispatch_address_uuid,
    customer_uuid,
    customer_name,
    pageNo,
    itemPerPage,
    from_date,
    to_date,
    status,
    columns,
    value,
  } = req.query;

  let tableName = 'latest_customer_dispatch_address'; // Adjust the table name based on your naming conventions
  let filter = filterFunctionality(
    {
      customer_dispatch_address_uuid,
      customer_uuid,
      customer_name,
    },
    status,
    to_date,
    from_date,
    Array.isArray(columns) ? columns : [columns],
    value,
  );

  // Apply additional filters or services if needed
  filter = await roleFilterService(filter, tableName, req.user);
  let pageFilter = pagination(pageNo, itemPerPage);
  let totalRecords = await getCountRecord(tableName, filter);
  let result = await getRecords(tableName, filter, pageFilter);

  return res.json(
    responser('Dispatch Addresses', result, result.length, totalRecords),
  );
};

exports.upsertContact = async (req, res) => {
  await isEditAccess('latest_contacts', req.user);
  removeNullValueKey(req.body);
  if (req.body.contact_uuid) {
    let contact_info = await getRecords(
      'latest_contacts',
      `where contact_uuid='${req.body.contact_uuid}'`,
    );
    if (!contact_info.length) throwError(404, 'Contact not found.');
    contact_info = contact_info[0];
    contact_info.create_ts = setDateTimeFormat(
      'timestemp',
      contact_info.create_ts,
    );
    req.body = { ...contact_info, ...req.body };
  } else {
    req.body.create_ts = setDateTimeFormat('timestemp');
    req.body.contact_uuid = v4();
  }
  await insertRecords('contacts', req.body);
  res.json(responser('Contact created or updated successfully.', req.body));

  //<------------ handle contact approval module properly ----------->
  const bodyData = {
    table_name: 'latest_contacts',
    record_uuid: req.body.contact_uuid,
    record_column_name: 'contact_uuid',
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

exports.getContact = async (req, res) => {
  const {
    contact_uuid,
    customer_uuid,
    pageNo,
    itemPerPage,
    from_date,
    to_date,
    status,
    columns,
    value,
  } = req.query;
  let tableName = 'latest_contacts';
  let filter = filterFunctionality(
    {
      contact_uuid,
      customer_uuid,
    },
    status,
    to_date,
    from_date,
    Array.isArray(columns) ? columns : [columns],
    value,
  );
  filter = await roleFilterService(filter, tableName, req.user);
  let pageFilter = pagination(pageNo, itemPerPage);
  let totalRecords = await getCountRecord(tableName, filter);
  let result = await getRecords(tableName, filter, pageFilter);
  return res.json(responser('Contact ', result, result.length, totalRecords));
};

exports.upsertBankDetails = async (req, res) => {
  await isEditAccess('latest_bank_details', req.user);
  removeNullValueKey(req.body);
  if (req.body.bank_details_uuid) {
    let bank_info = await getRecords(
      'latest_bank_details',
      `where bank_details_uuid='${req.body.bank_details_uuid}'`,
    );
    if (!bank_info.length) throwError(404, 'Bank Details not found.');
    bank_info = bank_info[0];
    bank_info.create_ts = setDateTimeFormat('timestemp', bank_info.create_ts);
    req.body = { ...bank_info, ...req.body };
  } else {
    req.body.create_ts = setDateTimeFormat('timestemp');
    req.body.bank_details_uuid = v4();
  }
  await insertRecords('bank_details', req.body);
  res.json(responser('Bank Details created successfully.', req.body));

  //<------------ handle bank details approval module properly ----------->
  const bodyData = {
    table_name: 'latest_bank_details',
    record_uuid: req.body.bank_details_uuid,
    record_column_name: 'bank_details_uuid',
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

exports.getBankDetails = async (req, res) => {
  const {
    bank_details_uuid,
    customer_uuid,
    customer_name,
    pageNo,
    itemPerPage,
    from_date,
    to_date,
    status,
    columns,
    value,
  } = req.query;
  let tableName = 'latest_bank_details';
  let filter = filterFunctionality(
    {
      bank_details_uuid,
      customer_uuid,
      customer_name,
    },
    status,
    to_date,
    from_date,
    Array.isArray(columns) ? columns : [columns],
    value,
  );
  filter = await roleFilterService(filter, tableName, req.user);
  let pageFilter = pagination(pageNo, itemPerPage);
  let totalRecords = await getCountRecord(tableName, filter);
  let result = await getRecords(tableName, filter, pageFilter);
  return res.json(
    responser('Bank Details ', result, result.length, totalRecords),
  );
};

exports.getBillingCompanyFromGst = async (req, res) => {
  const { gst_no } = req.query;
  let tableName = 'latest_customer_branch';
  let result = await dbRequest(
    `SELECT * FROM ${tableName} WHERE customer_branch_gst_in='${gst_no}'`,
  );
  return res.json(responser('Billing Company Details ', result));
};

exports.getTime = async (req, res) => {
  await dbRequest('SELECT NOW();');
  res.json(responser('Time ', setDateTimeFormat('timestemp')));
};

exports.loadCustomerData = async (req, res) => {
  await isEditAccess('latest_customer', req.user);
  const customer_uuid = v4();
  const bodyCustomer = {
    customer_uuid: customer_uuid,
    organization_type: req.body.organization_type,
    is_billing_company: 0,
    customer_name: req.body.customer_name,
    customer_website: req.body.customer_website,
    legal_entity: req.body.customer_name,
    registration_type: req.body.registration_type,
    status: 'ACTIVE',
    created_by_uuid: req.body.created_by_uuid,
    create_ts: setDateTimeFormat('timestemp'),
  };
  await insertRecords('customer', bodyCustomer);

  // <=================Loading Customer Branch Data=================>
  const bodyCustomerBranch = {
    customer_branch_uuid: v4(),
    customer_branch_name: req.body.customer_branch_name,
    customer_uuid: customer_uuid,
    customer_name: req.body.customer_name,
    customer_branch_gst_in: req.body.customer_branch_gst_in,
    pan_no: req.body.pan_no,
    customer_branch_address_line1: req.body.customer_branch_address_line1,
    customer_branch_address_line2: req.body.customer_branch_address_line2,
    customer_branch_address_city: req.body.customer_branch_address_city,
    customer_branch_address_state: req.body.customer_branch_address_state,
    customer_branch_address_pincode: req.body.customer_branch_address_pincode,
    customer_branch_address_country: req.body.customer_branch_address_country,
    customer_branch_mobile: req.body.customer_branch_mobile,
    customer_branch_phone_number: req.body.customer_branch_phone_number,
    customer_branch_website: req.body.customer_branch_website,
    customer_branch_mail_id: req.body.customer_branch_mail_id,
    created_by_uuid: req.body.created_by_uuid,
    create_ts: setDateTimeFormat('timestemp'),
  };

  await insertRecords('customer_branch', bodyCustomerBranch);

  // <=================Loading Contact Data=================>
  const bodyContact = {
    contact_uuid: v4(),
    name: req.body.name,
    customer_uuid: customer_uuid,
    customer_name: req.body.customer_name,
    salutation: req.body.salutation,
    designation: req.body.designation,
    contact_type: req.body.contact_type,
    department: req.body.department,
    extension: req.body.extension,
    company_landline: req.body.company_landline,
    fax: req.body.fax,
    website: req.body.website,
    dob: req.body.dob,
    previous_organisation: req.body.previous_organisation,
    skype_id: req.body.skype_id,
    executive_location_line1: req.body.executive_location_line1,
    executive_location_line2: req.body.executive_location_line2,
    executive_location_city: req.body.executive_location_city,
    executive_location_state: req.body.executive_location_state,
    executive_location_pincode: req.body.executive_location_pincode,
    executive_location_country: req.body.executive_location_country,
    contact_number: req.body.contact_number,
    mail_id: req.body.mail_id,
    status: 'ACTIVE',
    created_by_uuid: req.body.created_by_uuid,
    create_ts: setDateTimeFormat('timestemp'),
  };

  await insertRecords('contacts', bodyContact);

  // <=================Loading Customer Delivery Address Data=================>
  const bodyDeliveryAddress = {
    customer_delivery_address_uuid: v4(),
    customer_uuid: customer_uuid,
    customer_name: req.body.customer_name,
    delivery_name: req.body.delivery_name,
    customer_delivery_address_line1: req.body.customer_delivery_address_line1,
    customer_delivery_address_line2: req.body.customer_delivery_address_line2,
    customer_delivery_address_city: req.body.customer_delivery_address_city,
    customer_delivery_address_state: req.body.customer_delivery_address_state,
    customer_delivery_address_pincode:
      req.body.customer_delivery_address_pincode,
    customer_delivery_address_country:
      req.body.customer_delivery_address_country,
    status: 'ACTIVE',
    created_by_uuid: req.body.created_by_uuid,
    create_ts: setDateTimeFormat('timestemp'),
  };

  await insertRecords('customer_delivery_address', bodyDeliveryAddress);

  return res.json(
    responser('Saved customer data successfully ', {
      bodyCustomer,
      bodyCustomerBranch,
      bodyContact,
      bodyDeliveryAddress,
    }),
  );
};

exports.upsertCustomerAttachment = async (req, res) => {
  await isEditAccess('latest_customer_attachment', req.user);
  removeNullValueKey(req.body);
  if (req.body.customer_attachment_uuid) {
    let customer_attachment_info = await getRecords(
      'latest_customer_attachment',
      `where customer_attachment_uuid='${req.body.customer_attachment_uuid}'`,
    );
    if (!customer_attachment_info.length)
      throwError(404, 'Attachment not found.');
    customer_attachment_info = customer_attachment_info[0];
    customer_attachment_info.create_ts = setDateTimeFormat(
      'timestemp',
      customer_attachment_info.create_ts,
    );
    req.body = { ...customer_attachment_info, ...req.body };
  } else {
    req.body.create_ts = setDateTimeFormat('timestemp');
    req.body.customer_attachment_uuid = v4();
  }
  await insertRecords('customer_attachment', req.body);
  res.json(responser('Customer Attachment saved successfully.', req.body));

  //<------------ handle customer attachments approval module properly ----------->
  const bodyData = {
    table_name: 'latest_customer_attachment',
    record_uuid: req.body.customer_attachment_uuid,
    record_column_name: 'customer_attachment_uuid',
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

exports.getCustomerAttachment = async (req, res) => {
  const {
    customer_attachment_uuid,
    customer_attachment_name,
    customer_uuid,
    customer_name,
    pageNo,
    itemPerPage,
    from_date,
    to_date,
    status,
    columns,
    value,
  } = req.query;
  let tableName = 'latest_customer_attachment';
  let filter = filterFunctionality(
    {
      customer_attachment_uuid,
      customer_attachment_name,
      customer_uuid,
      customer_name,
    },
    status,
    to_date,
    from_date,
    Array.isArray(columns) ? columns : [columns],
    value,
  );
  filter = await roleFilterService(filter, tableName, req.user);
  let pageFilter = pagination(pageNo, itemPerPage);
  let totalRecords = await getCountRecord(tableName, filter);
  let result = await getRecords(tableName, filter, pageFilter);
  return res.json(
    responser('Attachments ', result, result.length, totalRecords),
  );
};
