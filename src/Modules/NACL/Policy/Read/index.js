module.exports = (app, db) => {
 // Read Polic[y|ies]
 app.get('/REST/policies', async (req, res) => {
  try {
   const { id } = req.query;

   const policies = id
    ? await db.query('SELECT * FROM nacl."Policies" WHERE 1=1 AND id=$1', [id])
    : await db.query('SELECT * FROM nacl."Policies"');

   res.json({
    success: true,
    msg: `Polic${1 === policies.rows.length ? 'y' : 'ies'} retrieved successfully.`,
    data: policies.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
