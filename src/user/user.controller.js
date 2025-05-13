const {
  pagination,
  filterFunctionality,
  getCountRecord,
  getRecords,
  insertRecords,
  roleFilterService,
  isEditAccess,
  isValidRecord,
  isRecordExist,
  upsertRecords,
  handleAuditColumns,
  updateRecord,
} = require('../../utils/dbFunctions');
const {
  responser,
  removeNullValueKey,
  throwError,
  getData,
  deleteKeyValuePair,
  setDateTimeFormat,
} = require('../../utils/helperFunction');
const { base_url } = require('../../config/server.config');
const { v4: uuidv4 } = require('uuid');
const bycrpt = require('bcryptjs');

// const path  = require('path');
const multer = require('multer');
const {
  userSessionService,
} = require('../authentication/authentication.service');

exports.upsertUser = async (req, res) => {
  await isEditAccess('latest_user', req.user);
  removeNullValueKey(req.body);
  let isUpadtion = false;

  const isExistRole = await isValidRecord('latest_roles', {
    role_uuid: req.body.role_uuid,
    status: 'ACTIVE',
  });

  if (!isExistRole) throwError(404, 'Role not found or inactive role.');
  const isExistBranch = await isValidRecord('latest_branch', {
    branch_uuid: req.body.branch_uuid,
    status: 'ACTIVE',
  });

  if (!isExistBranch) throwError(404, 'Role not found or inactive role.');

  let user = [];
  if (req.body.user_uuid) {
    isUpadtion = true;
    user = await getRecords(
      'latest_user',
      `where user_uuid='${req.body.user_uuid}' and email='${req.body.email}' and (status='ACTIVE' or status= 'INACTIVE')`,
    );
    if (!user.length) throwError(406, 'Invalid User');
    if (req.body.user_password)
      req.body.user_password = bycrpt.hashSync(req.body.user_password, 10);
  } else {
    const isExist = await isRecordExist(
      'user_fact',
      ['email'],
      [req.body.email],
    );
    if (isExist) throwError(406, 'User already exist.');
    if (!req.body.user_password) throwError(406, 'Password should be filled.');
    req.body.user_password = bycrpt.hashSync(req.body.user_password, 10);
    req.body.user_uuid = uuidv4();
    await insertRecords('user_fact', req.body);
    user = await getRecords(
      'user_fact',
      `where email='${req.body.email}'`,
      null,
      null,
      { isPrmiaryId: true },
    );
  }
  req.body = { ...user[0], ...req.body };
  await insertRecords('user_dim', req.body);
  req.body.personal_email = req.body.email;
  if (!isUpadtion) await insertRecords('user_profile', req.body);
  delete req.body.user_password;

  res.json(responser('User created successfully.', req.body));

  (async () => {
    try {
      let historyMessage = '';
      let userInfo = (
        await getRecords(
          'latest_user',
          `where user_uuid= '${req.body.created_by_uuid}'`,
        )
      )[0];
      if (isUpadtion) {
        historyMessage = `${req.body.first_name} upadate has been done`;
      } else {
        historyMessage = `${req.body.first_name} you have successfuly signed up`;
      }
      const bodyData = {
        module_name: 'UserDim and UserProfile',
        module_uuid: req.body.user_uuid,
        message: historyMessage,
        module_column_name: 'user_uuid',
        created_by_uuid: req.body.user_uuid,
      };
      await getData(
        base_url + '/api/v1/history/upsert-history',
        null,
        'json',
        bodyData,
        'POST',
      );
    } catch (error) {
      console.log(error);
    }
  })();
};

exports.upsertUserProfile = async (req, res) => {
  await isEditAccess('latest_user', req.user);
  removeNullValueKey(req.body);
  let isUpadtion = false;
  const { user_uuid, role_uuid } = req.body;
  let user = await getRecords('latest_user', `where user_uuid='${user_uuid}'`);
  if (!user.length) throwError(404, 'User not found.');
  user = user[0];
  req.body.modified_by_uuid = req.body.created_by_uuid;
  req.body.created_by_uuid = user.created_by_uuid;
  updatedData = { ...user, ...req.body };

  let [user_dim] = await getRecords(
    'latest_user_dim',
    `where user_uuid='${user_uuid}'`,
  );

  if (user_dim.role_uuid !== req.body.role_uuid) {
    // if  role are updated then chnage the role in user dim

    const isRoleExist = await isValidRecord('latest_roles', {
      role_uuid,
      status: 'ACTIVE',
    });
    if (!isRoleExist) throwError(400, 'Invalid Role');
    await upsertRecords(
      'user_dim',
      req.body,
      `where user_uuid="${user_uuid}"`,
      null,
      { otherViewName: 'latest_user' },
    );
    // log out user
    userSessionService({ user_uuid });
  }
  if (user.status !== req.body.status) {
    await updateRecord(
      'user_fact',
      { status: req.body.status },
      { user_uuid: user.user_uuid },
    );
  }

  if (
    req.body.billing_company_branches &&
    req.body.billing_company_branches.length > 0
  ) {
    let branchData = req.body.billing_company_branches.map((branch) => ({
      user_uuid: req.body.user_uuid,
      billing_company_branch_uuid: branch.billing_company_branch_uuid,
      status: req.body.status,
    }));
    await handleAuditColumns('latest_user', branchData, ['user_uuid']);
    await insertRecords('branch', branchData);
  }
  if (
    req.body.affiliated_billing_company_uuids &&
    req.body.affiliated_billing_company_uuids.length > 0
  ) {
    let oldUserDimRecord = (
      await getRecords('latest_user_dim', filterFunctionality({ user_uuid }))
    )[0];
    if (oldUserDimRecord) {
      let newUserDimRecord = {
        ...oldUserDimRecord,
        affiliated_billing_company_uuids:
          req.body.affiliated_billing_company_uuids,
      };
      await insertRecords('user_dim', newUserDimRecord);
    }
  }

  await insertRecords('user_profile', updatedData);
  res.json(responser('User Profile created  successfully.', updatedData));

  (async () => {
    try {
      let historyMessage = '';
      let userInfo = (
        await getRecords(
          'latest_user',
          `where user_uuid= '${req.body.created_by_uuid}'`,
        )
      )[0];
      if (isUpadtion) {
        historyMessage = `${userInfo?.first_name} has made an update in User.`;
      } else {
        historyMessage = `${userInfo?.first_name} has created a User.`;
      }
      const bodyData = {
        module_name: 'User',
        module_uuid: req.body.user_uuid,
        message: historyMessage,
        module_column_name: 'user_uuid',
        created_by_uuid: req.body.created_by_uuid,
      };
      await getData(
        base_url + '/api/v1/history/upsert-history',
        null,
        'json',
        bodyData,
        'POST',
      );
    } catch (error) {
      console.log(error);
    }
  })();
};

exports.getUser = async (req, res) => {
  const {
    user_uuid,
    role_uuid,
    billing_company_uuid,
    billing_company_branch_uuid,
    role_group,
    role_value,
    pageNo,
    itemPerPage,
    from_date,
    to_date,
    status,
    columns,
    value,
  } = req.query;

  let tableName = 'latest_user';
  let filter = filterFunctionality(
    {
      user_uuid,
      role_uuid,
      // billing_company_uuid,
      // billing_company_branch_uuid,
      role_group,
      role_value,
    },
    status,
    to_date,
    from_date,
    Array.isArray(columns) ? columns : [columns],
    value,
  );
  let userUuids = [];

  if (user_uuid !== req.user.user_uuid) {
    let roleFilter = await roleFilterService(filter, tableName, req.user);
    console.log('roleFilter==>', roleFilter);
    // if (roleFilter.includes('branch_uuid')) {
    //   userUuids = (await getRecords('latest_branch', roleFilter)).map(
    //     (user) => user.user_uuid,
    //   );
    //   filter +=
    //     (filter ? ` and ` : 'Where ') +
    //     `user_uuid in ("${userUuids.join('","')}")`;
    // }
  }
  if (!user_uuid) {
    filter +=
      (filter ? ' and ' : 'Where ') +
      `JSON_CONTAINS(affiliated_billing_company_uuids, '{"billing_company_uuid": "${billing_company_uuid}"}')`;
  }
  if (billing_company_branch_uuid) {
    filter +=
      (filter ? ' and ' : 'Where ') +
      `JSON_CONTAINS(billing_company_branches, '{"billing_company_branch_uuid": "${billing_company_branch_uuid}"}')`;
  }
  let pageFilter = pagination(pageNo, itemPerPage);
  let totalRecords = await getCountRecord(tableName, filter);
  let result = await getRecords(tableName, filter, pageFilter);
  if (user_uuid === req.user.user_uuid && result.length) {
    result[0].module_security = await getRecords(
      'latest_module',
      `where role_uuid= '${req.user.role_uuid}'`,
    );
  }
  // if (result.length === 1) {
  //   let userBranches = await getRecords(
  //     'latest_branch',
  //     filterFunctionality({ user_uuid, status: 'ACTIVE' }),
  //   );
  //   result[0].branches = userBranches.map((branch) => ({
  //     branch_name: branch.branch_name,
  //     branch_uuid: branch.branch_uuid,
  //   }));
  // }
  deleteKeyValuePair(result, ['user_password']);
  return res.json(responser('All User', result, result.length, totalRecords));
};

exports.upsertBranch = async (req, res) => {
  // await isEditAccess('latest_branch', req.user);
  removeNullValueKey(req.body);
  req.body.branch_name = req.body.branch_name.toUpperCase();
  let isUpadtion = false;
  if (req.body.branch_uuid) {
    let isExist = await isValidRecord('latest_branch', {
      branch_uuid: req.body.branch_uuid,
    });
    if (!isExist) throwError(404, 'Branch not found.');
    isUpadtion = true;
  } else {
    let isExist = await isValidRecord('latest_branch', {
      branch_name: req.body.branch_name,
    });
    if (isExist) throwError(404, 'Branch is already exists.');
    req.body.branch_uuid = uuidv4();
  }
  let branch = await insertRecords('branch', req.body);
  res.json(responser('Branch created  successfully.', req.body));
};

exports.getBranch = async (req, res) => {
  const {
    branch_uuid,
    pageNo,
    itemPerPage,
    from_date,
    to_date,
    status,
    columns,
    value,
  } = req.query;

  let tableName = 'latest_branch';
  let filter = filterFunctionality(
    {
      branch_uuid,
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
  return res.json(responser('All Branch', result, result.length, totalRecords));
};

exports.upsertZone = async (req, res) => {
  await isEditAccess('zone', req.user);
  removeNullValueKey(req.body);
  let isUpadtion = false;
  req.body.zone_name = req.body.zone_name.toUpperCase();
  if (req.body.zone_uuid) {
    let isExist = await isValidRecord('zone', {
      zone_uuid: req.body.zone_uuid,
    });
    if (!isExist) throwError(404, 'zone not found.');
    isUpadtion = true;
  } else {
    let isExist = await isValidRecord('zone', {
      zone_name: req.body.zone_name,
    });
    if (isExist) throwError(404, 'Zone is already exists.');
    req.body.zone_uuid = uuidv4();
  }
  let zone = await insertRecords('zone', req.body);
  res.json(responser('Zone created  successfully.', req.body));
};

exports.getZone = async (req, res) => {
  const {
    zone_uuid,
    pageNo,
    itemPerPage,
    from_date,
    to_date,
    status,
    columns,
    value,
  } = req.query;

  let tableName = 'zone';
  let filter = filterFunctionality(
    {
      zone_uuid,
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
  return res.json(responser('All Zone', result, result.length, totalRecords));
};

exports.changeUserRole = async (req, res) => {
  // isEditAccess('change_role',req.user);
  const { user_uuid, role_uuid } = req.body;
  const isUserExist = await isValidRecord('latest_user', {
    user_uuid,
    status: 'ACTIVE',
  });
  if (!isUserExist) throwError(400, 'Invalid User');
  const isRoleExist = await isValidRecord('latest_roles', {
    role_uuid,
    status: 'ACTIVE',
  });
  if (!isRoleExist) throwError(400, 'Invalid Role');
  await upsertRecords(
    'user_dim',
    req.body,
    `where user_uuid="${user_uuid}"`,
    null,
    { otherViewName: 'latest_user' },
  );
  res.json(responser('Role has been changed.'));
};

exports.upsertManageSite = async (req, res) => {
  // removeNullValueKey(req.body);
  if (req.body.manage_site_uuid) {
    let manage_site_info = await getRecords(
      'latest_manage_site',
      `where manage_site_uuid='${req.body.manage_site_uuid}'`,
    );
    if (!manage_site_info.length) throwError(404, 'manage site  not found.');
    manage_site_info = manage_site_info[0];
    req.body.modified_by_uuid = req.body.created_by_uuid;
    req.body.created_by_uuid = manage_site_info.created_by_uuid;
    req.body = { ...manage_site_info, ...req.body };
  } else {
    req.body.create_ts = setDateTimeFormat('timestemp');
    req.body.manage_site_uuid = uuidv4();
  }
  await insertRecords('manage_site', req.body);
  res.json(responser('Mange SIte created or updated successfully.', req.body));
};
exports.getManageSite = async (req, res) => {
  const {
    manage_site_id,
    manage_site_uuid,
    itemPerPage,
    pageNo,
    from_date,
    to_date,
    status,
    columns,
    value,
  } = req.query;

  let tableName = 'latest_manage_site';
  let filter = filterFunctionality(
    {
      manage_site_id,
      manage_site_uuid,
    },
    status,
    to_date,
    from_date,
    Array.isArray(columns) ? columns : [columns],
    value,
  );

  let pageFilter = pagination(pageNo, itemPerPage);
  let totalRecords = await getCountRecord(tableName, filter);
  let result = await getRecords(tableName, filter, pageFilter);
  return res.json(
    responser('Mange Site: ', result, result.length, totalRecords),
  );
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'img/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage }).single('image');

exports.uploadImage = async (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    console.log('req.file: ', req.file);
    console.log('req.body: ', req.body);

    const image = req.file;

    if (!image) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const imageName = image.filename;
    console.log('imageName: ', imageName);

    const imagePath = `img/${imageName}`;
    console.log('imagePath: ', imagePath);
    res.json(responser('Upload Image.', [{ imagePath: imagePath }]));
  });
};

exports.changeUserPwd = async (req, res) => {
  // isEditAccess('change_role',req.user);
  const { role_value } = req.user;

  const approved_role = ['ADMIN', 'SUPERADMIN'];

  const isEditAccess = approved_role.includes(role_value);

  if (!isEditAccess) throwError(400, 'only admin can change pwd');

  console.log(role_value, isEditAccess);

  const { user_uuid } = req.body;
  const isUserExist = await isValidRecord('latest_user', {
    user_uuid,
    status: 'ACTIVE',
  });
  if (!isUserExist) throwError(400, 'Invalid User');

  if (req.body.user_password) {
    req.body.user_password = bycrpt.hashSync(req.body.user_password, 10);
  }
  await upsertRecords(
    'user_dim',
    req.body,
    `where user_uuid="${user_uuid}"`,
    null,
    { otherViewName: 'latest_user' },
  );

  // logout session after pwd chnage
  userSessionService({ user_uuid });

  (async () => {
    try {
      let historyMessage = '';
      let userInfo = (
        await getRecords('latest_user', `where user_uuid= '${user_uuid}'`)
      )[0];

      historyMessage = `${req.user?.first_name} has changed ${userInfo?.first_name}'s password.`;

      const bodyData = {
        module_name: 'User',
        module_uuid: req.body.user_uuid,
        message: historyMessage,
        module_column_name: 'user_uuid',
        created_by_uuid: req.body.created_by_uuid,
      };
      await getData(
        base_url + '/api/v1/history/upsert-history',
        null,
        'json',
        bodyData,
        'POST',
      );
    } catch (error) {
      console.log(error);
    }
  })();

  res.json(responser('password has been changed.'));
};

exports.insertUserInBulk = async (req, res) => {
  console.log('req.body', req.body.length);
  for (const i of req.body) {
    req.body = {
      user_id: i['Employee '],
      user_password: '12345678',
      role_uuid: 'ef6fcb01-44d1-4528-94d0-27e5a755b086',
      affiliated_billing_company_uuids: [
        {
          billing_company_name: 'Sharma Sawhney and Co.',
          billing_company_uuid: '4b7ecf35-611c-433a-82ec-3124833f29af',
        },
      ],
      billing_company_branches: [
        {
          billing_company_branch_name: 'Modinagar',
          billing_company_branch_uuid: 'e4d70f3f-aebb-4a75-9591-fb3d4f8b55ec',
        },
      ],
      branch_uuid: 'e4d70f3f-aebb-4a75-9591-fb3d4f8b55ec',
      first_name: i['First Name'],
      last_name: i['Last Name'],
      middle_name: i['Middle Name'],
      email: i['Email'],
      mobile_number: i['Mobile Number'],
      gender: i['Gender'],
      date_of_birth: i['Date Of Birth (dd-mmm-yyyy)'],
      hire_date: i['Date Joined (dd-mmm-yyyy)'],
      last_day_of_work: i['Contract End Date (dd-mmm-yyyy)'],
      legal_entity: i['Legal Entity'],
      department_name: i['Department'],
      sub_department: i['Sub Department'],
      business_unit: i['Business Unit'],
      job_title: i['Job Title'],
      secondary_job_title: i['Secondary Job Title'],
      branch_name: i['Location'],
      user_type: i['Worker Type'],
      reporting_manager_employee_no: i["Reporting Manager's Employee Number"],
      assigned_phone_number: i['Work Phone'],
      mobile: i['Residence Number'],
      email: i['Email'],
      personal_email: i['Personal Email'],
      skype_id: i['Skype Id'],
      marital_status: i['Marital Status'],
      marriage_date: i['Marriage Date (dd-mmm-yyyy)'],
      father_name: i['Father Name'],
      mother_name: i['Mother Name'],
      spouse_name: i['Spouse Name'],
      spouse_gender: i['Spouse Gender'],
      is_physically_handicapped:
        i['Physically Handicapped'] == 'Yes' ? true : false,
      blood_group: i['Blood Group'],
      nationality: i['Nationality'],
      salary_payment_mode: i['Salary Payment Mode'],
      bank_name: i['Bank Name'],
      bank_ifsc_code: i['IFSC Code'],
      bank_account_number: i['Bank Account Number'],
      bank_account_name: i['Name On Bank Account'],
      pf_establishment_id: i['PF Establishment Id'],
      pf_details_available: i['PF Details Available'],
      pf_number: i['PF Number'],
      pf_account_name: i['Name On PF Account'],
      uan: i['UAN'],
      esi_eligible: i['ESI Eligible'] == null ? null : 'Yes' ? true : false,
      employee_esi_number: i['Employer ESI Number'],
      esi_details_available: i['ESI Details Available'],
      esi_number: i['ESI Number'],
      pt_establishment_id: i['PT Establishment Id'],
      lwf_eligible: i['LWF Eligible'] == null ? null : 'Yes' ? true : false,
      aadhaar_number: i['Aadhaar Number'],
      enrollment_number: i['Enrollment Number'],
      dob_in_aadhaar_card: i['DOB in Aadhaar card (dd-mmm-yyyy)'],
      full_name_as_per_aadhaar_card: i['Full name as per Aadhaar card'],
      address_as_in_aadhaar_card: i['Address as in Aadhaar card'],
      gender_as_in_aadhaar_card: i['Gender as in Aadhaar card'],
      pan_card_available:
        i['Pan Card Available'] == null ? null : 'Yes' ? true : false,
      pan_number: i['PAN Number'],
      full_name_as_per_pan_card: i['Full name as per PAN card'],
      dob_in_pan_card: i['DOB in PAN card (dd-mmm-yyyy)'],
      parents_name_as_per_pan_card: i[`Parent's Name as per PAN card`],
    };
    console.log('req.body', req.body);
    const isExistRole = await isValidRecord('latest_roles', {
      role_uuid: req.body.role_uuid,
      status: 'ACTIVE',
    });

    if (!isExistRole) throwError(404, 'Role not found or inactive role.');

    const isExistBranch = await isValidRecord('latest_branch', {
      branch_uuid: req.body.branch_uuid,
      status: 'ACTIVE',
    });

    if (!isExistBranch) throwError(404, 'Role not found or inactive role.');

    let user = [];

    const isExist = await isRecordExist(
      'user_fact',
      ['email'],
      [req.body.email],
    );
    if (isExist) throwError(406, 'User already exist.');
    if (!req.body.user_password) throwError(406, 'Password should be filled.');
    req.body.user_password = bycrpt.hashSync(req.body.user_password, 10);
    req.body.user_uuid = uuidv4();
    await insertRecords('user_fact', req.body);
    user = await getRecords(
      'user_fact',
      `where email='${req.body.email}'`,
      null,
      null,
      { isPrmiaryId: true },
    );

    req.body = { ...user[0], ...req.body };
    await insertRecords('user_dim', req.body);
    // req.body.personal_email = req.body.email;
    await insertRecords('user_profile', req.body);
    delete req.body.user_password;
  }
  res.json(responser('User Details imported successfully.'));
};
