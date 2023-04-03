module.exports = (app, db) => {
 // Read Emergency Contact[s]
 app.get('/REST/emergency_contacts', async (req, res) => {
  try {
   const { id } = req.query;

   const emergencyContacts = id
    ? await db.query('SELECT * FROM public."Emergency_Contacts" WHERE 1=1 AND id=$1', [id])
    : await db.query('SELECT * FROM public."Emergency_Contacts"');

   res.json({
    success: true,
    msg: `Emergency contact${
     1 === emergencyContacts.rows.length ? '' : 's'
    } retrieved successfully.`,
    data: emergencyContacts.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
