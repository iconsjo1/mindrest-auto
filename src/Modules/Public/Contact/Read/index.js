module.exports = (app, db) => {
 // Read Contact[s]
 app.get('/REST/contacts', async (req, res) => {
  try {
   const { id } = req.query;

   const contacts = id
    ? await db.query('SELECT * FROM public."Contacts" WHERE 1=1 AND id=$1', [id])
    : await db.query('SELECT * FROM public."Contacts"');

   res.json({
    success: true,
    msg: `Contact${1 === contacts.rows.length ? '' : 's'} retrieved successfully.`,
    data: contacts.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
