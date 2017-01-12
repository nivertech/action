exports.up = async(r) => {
  const tables = [
    r.tableCreate('InactiveUser'),
  ];
  try {
    await Promise.all(tables);
  } catch (e) {
  }
  const indices = [
    r.table('InactiveUser').indexCreate('userIdStartAt', (row) => [row('userId'), row('startAt')]),
    r.table('InactiveUser').indexCreate('orgIdStartAt', (row) => [row('orgId'), row('startAt')]),
  ];
  try {
    await Promise.all(indices);
  } catch (e) {
  }
};

exports.down = async(r) => {
  const tables = [
    r.tableDrop('InactiveUser'),
  ];
  await Promise.all(tables);
};
