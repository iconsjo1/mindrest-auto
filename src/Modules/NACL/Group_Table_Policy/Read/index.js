module.exports = (app, db) => {
 // Read Group Table Policy[s]
 app.get('/REST/group_table_policies', async (req, res) => {
  try {
   const { id } = req.query;

   const groupTablePolicies = id
    ? await db.query('SELECT * FROM nacl."Group_Table_Policies" WHERE 1=1 AND id=$1', [id])
    : await db.query('SELECT * FROM nacl."Group_Table_Policies"');

   res.json({
    success: true,
    msg: `Group table polic${
     1 === groupTablePolicies.rows.length ? 'y' : 'ies'
    } retrieved successfully.`,
    data: groupTablePolicies.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
