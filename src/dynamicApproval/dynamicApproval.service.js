const { getRecords } = require('../../utils/dbFunctions');

exports.creatorOwnsCurrentApprovalStep = async (approval_hierarchy, record) => {
  const approvalSteps = approval_hierarchy?.[0]?.approval || [];
  const { created_by_uuid } = record;

  const [user] = await getRecords(
    'latest_user',
    `where user_uuid = '${created_by_uuid}'`,
  );

  if (!user) return false;

  const isCreatorOwnsCurrentApprovalStep = approvalSteps.some(
    ({ type, uuid }) => {
      if (type === 'ROLE') return user.role_uuid === uuid;
      if (type === 'USER') return user.user_uuid === uuid;
      return false;
    },
  );

  return isCreatorOwnsCurrentApprovalStep;
};
