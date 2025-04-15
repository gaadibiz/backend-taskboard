const { v4 } = require('uuid');
const {
  handleAuditColumns,
  insertRecords,
  filterFunctionality,
  advanceFiltering,
  pagination,
  getRecords,
  getCountRecord,
} = require('../../utils/dbFunctions');
const {
  generateCode,
  responser,
  throwError,
  hashObject,
} = require('../../utils/helperFunction');

exports.upsertDraft = async (req, res) => {
  let draft_info = await handleAuditColumns('latest_draft', req.body, [
    'draft_code',
    'created_by_uuid',
  ]);

  let isHashMatch = false;

  if (!draft_info) {
    req.body.draft_code = generateCode();
    req.body.draft_uuid = v4();
    req.body.created_by_name = req.user.first_name;
  } else {
    if (
      hashObject(draft_info.reference_data) ===
      hashObject(req.body.reference_data)
    ) {
      isHashMatch = true;
    }

    req.body = {
      ...draft_info,
      ...req.body,
    };
  }

  if (!isHashMatch) {
    req.body.modified_by_uuid = req.user.user_uuid;
    req.body.modified_by_name = req.user.first_name;
    await insertRecords('draft', req.body);
  }
  return res.json(responser('Draft saved successfully', req.body));
};

exports.getDraft = async (req, res) => {
  const tableName = 'latest_draft';
  let {
    draft_code,
    created_by_uuid,
    reference_data_uuid,
    pageNo,
    itemPerPage,
    from_date,
    to_date,
    status,
    columns,
    value,
    pageLimit,
    advanceFilter,
  } = req.query;
  let filter = filterFunctionality(
    {
      draft_code,
      created_by_uuid,
      reference_data_uuid,
    },
    status,
    to_date,
    from_date,
    Array.isArray(columns) ? columns : [columns],
    value,
  );

  if (advanceFilter) filter = advanceFiltering(filter, advanceFilter);
  let pageFilter = pagination(pageNo, itemPerPage, pageLimit);
  let totalRecords = await getCountRecord(tableName, filter);
  let result = await getRecords(tableName, filter, pageFilter);

  return res.json(responser('Draft: ', result, result.length, totalRecords));
};
// <-------------------------------------------------------Receivable Payment (Modification in records)------------------------------------------------------------------------->
exports.deleteDraft = async (req, res) => {
  const tableName = 'latest_draft';
  let { form_url } = req.body;

  let result = await getRecords(tableName, `WHERE form_url = '${form_url}'`);

  if (!result.length) return throwError(404, 'Draft Not Found');

  let promiseArr = [];
  result?.map(
    async (data) =>
      await insertRecords('draft', { ...data, status: 'INACTIVE' }),
  );

  await Promise.all(promiseArr);
  //mark status inactive to delete record

  return res.json(responser('Draft deleted successfully', promiseArr));
};
