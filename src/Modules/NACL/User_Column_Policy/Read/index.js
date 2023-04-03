module.exports = (app, db) => {
 // Read User Column Policy[s]
 app.get('/REST/user_column_policies', async (req, res) => {
  try {
   const { id } = req.query;

   const userColumnPolicies = id
    ? await db.query('SELECT * FROM nacl."User_Column_Policies" WHERE 1=1 AND id=$1', [id])
    : await db.query('SELECT * FROM nacl."User_Column_Policies"');

   res.json({
    success: true,
    msg: `User column polic${
     1 === userColumnPolicies.rows.length ? 'y' : 'ies'
    } retrieved successfully.`,
    data: userColumnPolicies.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
