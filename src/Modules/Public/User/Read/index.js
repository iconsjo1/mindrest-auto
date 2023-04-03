module.exports = route => (app, db) => {
 // Read User[s]
 app.get(route, async (req, res) => {
  try {
   const { id } = req.query;

   const users = id
    ? await db.query('SELECT * FROM public."Users" WHERE 1=1 AND id=$1', [id])
    : await db.query('SELECT * FROM public."Users"');

   res.json({
    success: true,
    msg: `User${1 === users.rows.length ? '' : 's'} retrieved successfully.`,
    data: users.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
