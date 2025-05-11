const { getRecords, insertRecords } = require('../../utils/dbFunctions');
const { throwError, setDateTimeFormat } = require('../../utils/helperFunction');
const { v4: uuid } = require('uuid');

exports.insertExpenseLedger = async (debit = 0, credit = 0, record_uuid) => {
  if (!debit && !credit) {
    console.log('Both debit and credit cannot be zero');
    return; // cannot be zero
  }
  if (debit && credit) {
    console.log('Both debit and credit cannot be avilable at same time');
    return; // cannot be avilable at same time
  }

  if (!record_uuid) {
    return throwError(400, 'Invalid data');
  }

  const [expense] = await getRecords(
    'latest_expense',
    `where expense_uuid = '${record_uuid}'`,
  );

  if (!expense) {
    return throwError(400, 'Expense not found');
  }

  const [advance] = await getRecords(
    'latest_user_advance',
    `where user_uuid = '${expense.user_uuid || expense.vendor_uuid}' and billing_company_uuid = '${expense.billing_company_uuid}'`,
  );

  console.log(advance, '...............................................');

  const advance_payload = {
    user_advance_uuid: uuid(),
    advance_type: expense.expense_type,
    user_uuid: expense.user_uuid || expense.vendor_uuid,
    user_name: expense.user_name || expense.vendor_name,
    project_uuid: expense.project_uuid,
    project_name: expense.project_name,
    advance_amount: 0,
    pending_amount: 0,
    billing_company_uuid: expense.billing_company_uuid,
    billing_company_name: expense.billing_company_name,
    billing_company_branch_uuid: expense?.billing_company_branch_uuid,
    billing_company_branch_name: expense?.billing_company_branch_name,
    create_ts: setDateTimeFormat('timestemp'),
    ...advance,
  };

  let expense_ledger_payload = {
    user_advance_ledger_uuid: uuid(),
    record_uuid: record_uuid,
    debit: debit,
    credit: credit,
    balance: 0,
    create_ts: setDateTimeFormat('timestemp'),
    ...advance_payload,
  };

  if (credit) {
    advance_payload.advance_amount += credit;
    advance_payload.pending_amount += credit;
    expense_ledger_payload.balance = advance_payload.pending_amount;
    expense_ledger_payload.status = 'CREDIT';
  }

  if (debit) {
    if (advance_payload.pending_amount < debit) {
      // Only reduce what's available, but don't allow negative balance
      advance_payload.pending_amount = 0;
    } else {
      advance_payload.pending_amount -= debit;
    }
    expense_ledger_payload.balance = advance_payload.pending_amount;
    expense_ledger_payload.status = 'DEBIT';
  }

  //   console.log(advance_payload);
  //   console.log(expense_ledger_payload);

  await insertRecords('user_advance', advance_payload);
  await insertRecords('user_advance_ledger', expense_ledger_payload);
};

(async () => {
  //   await this.insertExpenseLedger(68, 0, '6f9887f5-bd9f-4f8f-a2d5-f575406fe352');
})();
