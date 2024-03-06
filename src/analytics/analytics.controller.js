const { responser } = require('../../utils/helperFunction');
const {
  dbRequest,
  filterFunctionality,
  getCountRecord,
  roleFilterService,
} = require('../../utils/dbFunctions');

exports.pieChartTaskAnalytics = async (req, res) => {
  let filter = await roleFilterService('', 'latest_tasks', req.user);
  const query = `select status ,count(1) as count from latest_tasks ${filter} GROUP BY status;`;

  const result = await dbRequest(query);
  return res.json(responser('Pie Chart Task Data', result));
};
