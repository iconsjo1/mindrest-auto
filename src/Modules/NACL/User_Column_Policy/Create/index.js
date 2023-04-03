const { isPositiveInteger } = require('../../../../Utils');

module.exports = (app, db) => {
 // Create User Column Policy
 app.post('/REST/user_column_policies', async (req, res) => {
  try {
   const { user_id, column_policies } = req.body;
   // Guards
   if (!isPositiveInteger(user_id))
    return res.json({ success: false, msg: 'User id is required as a positive integer' });

   if (!Array.isArray(column_policies) || 0 === column_policies.length)
    return res.json({ success: false, msg: 'Column policies not provided properly' });

   // Add values
   const values = [user_id];
   const enc_values = [];

   for (let i = 0, j = 1; i < column_policies.length; i++) {
    const { column_id, policy_id } = column_policies[i];
    if (!(isPositiveInteger(column_id) && isPositiveInteger(policy_id)))
     throw new Error('Column policy #' + ++i + ' is not defined properly');

    values.push(column_id, policy_id);
    enc_values.push(`($1,$${++j},$${++j})`);
   }

   const newUserColumnPolicies = await db.query(
    `INSERT INTO nacl."User_Column_Policies"(user_id, column_id, policy_id) VALUES${enc_values.join(
     ','
    )} RETURNING *`,
    values
   );
   res.json({
    success: true,
    msg: `User column polic${
     1 === newUserColumnPolicies.rows.length ? 'y' : 'ies'
    } created successfully.`,
    data: newUserColumnPolicies.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
