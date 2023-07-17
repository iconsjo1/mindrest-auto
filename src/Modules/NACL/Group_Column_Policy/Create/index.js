const { isPositiveInteger } = require('../../../../Utils');
module.exports = (app, db) => {
 // Create Group Column Policy
 app.post('/REST/group_column_policies', async (req, res) => {
  try {
   const { group_id, column_policies } = req.body;
   // Guards
   if (!isPositiveInteger(group_id))
    return res.json({ success: false, msg: 'Group id is required as a positive integer' });

   if (!Array.isArray(column_policies) || 0 === column_policies.length)
    return res.json({ success: false, msg: 'Column policies not provided properly' });

   // Add values
   const values = [group_id];
   const enc_values = [];

   for (let i = 0, j = 1; i < column_policies.length; i++) {
    const { column_id, policy_id } = column_policies[i];
    if (!(isPositiveInteger(column_id) && isPositiveInteger(policy_id)))
     throw new Error('Column policy #' + ++i + ' is not defined properly');

    values.push(column_id, policy_id);
    enc_values.push(`($1,$${++j},$${++j})`);
   }

   const newGroupColumnPolicies = await db.query(
    `INSERT INTO nacl."Group_Column_Policies"(group_id, column_id, policy_id) VALUES${enc_values} RETURNING *`,
    values
   );
   res.json({
    success: true,
    msg: `Group column polic${
     1 === newGroupColumnPolicies.rows.length ? 'y' : 'ies'
    } created successfully.`,
    data: newGroupColumnPolicies.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
