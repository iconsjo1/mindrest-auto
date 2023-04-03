module.exports = (app, db) => {
 // Read User Table Policy[s]
 app.get('/REST/user_table_policies', async (req, res) => {
  try {
   const { id } = req.query;

   const UserTablePolicies = id
    ? await db.query('SELECT * FROM nacl."User_Table_Policies" WHERE 1=1 AND id=$1', [id])
    : await db.query('SELECT * FROM nacl."User_Table_Policies"');

   res.json({
    success: true,
    msg: `User table polic${
     1 === UserTablePolicies.rows.length ? 'y' : 'ies'
    } retrieved successfully.`,
    data: UserTablePolicies.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
