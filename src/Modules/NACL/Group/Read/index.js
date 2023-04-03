module.exports = (app, db) => {
 // Read Group[s]
 app.get('/REST/groups', async (req, res) => {
  try {
   const { id } = req.query;

   const groups = id
    ? await db.query('SELECT * FROM nacl."Groups" WHERE 1=1 AND id=$1', [id])
    : await db.query('SELECT * FROM nacl."Groups"');

   res.json({
    success: true,
    msg: `Group${1 === groups.rows.length ? '' : 's'} retrieved successfully.`,
    data: groups.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
