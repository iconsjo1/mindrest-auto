const { isPositiveInteger } = require('../../../../Utils');

module.exports = (app, db) => {
 // Create User Table POLICY
 app.post('/REST/user_table_policies', async (req, res) => {
  try {
   const { user_id, table_policies } = req.body;
   // Guards
   if (!isPositiveInteger(user_id))
    return res.json({ success: false, msg: 'User id is required as a positive integer' });

   if (!Array.isArray(table_policies) || 0 === table_policies.length)
    return res.json({ success: false, msg: 'Table policies not provided properly' });

   // Add values
   const values = [user_id];
   const enc_values = [];

   for (let i = 0, j = 1; i < table_policies.length; i++) {
    const { table_id, policy_id } = table_policies[i];
    if (!(isPositiveInteger(table_id) && isPositiveInteger(policy_id)))
     throw new Error('Table policy #' + ++i + ' is not defined properly');

    values.push(table_id, policy_id);
    enc_values.push(`($1,$${++j},$${++j})`);
   }

   const newUserTablePolicies = await db.query(
    `INSERT INTO nacl."User_Table_Policies"(user_id, table_id, policy_id) VALUES${enc_values.join(
     ','
    )} RETURNING *`,
    values
   );
   res.json({
    success: true,
    msg: `User table polic${
     1 === newUserTablePolicies.rows.length ? 'y' : 'ies'
    } created successfully.`,
    data: newUserTablePolicies.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
