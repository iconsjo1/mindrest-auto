module.exports = (app, db) => {
 // Read Group Column Policy[s]
 app.get('/REST/group_column_policies', async (req, res) => {
  try {
   const { id } = req.query;

   const groupColumnPolicies = id
    ? await db.query('SELECT * FROM nacl."Group_Column_Policies" WHERE 1=1 AND id=$1', [id])
    : await db.query('SELECT * FROM nacl."Group_Column_Policies"');

   res.json({
    success: true,
    msg: `Group column polic${
     1 === groupColumnPolicies.rows.length ? 'y' : 'ies'
    } retrieved successfully.`,
    data: groupColumnPolicies.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
