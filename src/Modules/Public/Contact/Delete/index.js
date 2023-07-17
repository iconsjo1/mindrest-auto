module.exports = (app, db) => {
 // Delete Contact
 app.delete('/REST/contacts', async (req, res) => {
  try {
   const { db } = res.locals.utils;

   const { id } = req.query;
   if (!id) return res.status(404).json({ success: false, msg: 'Contact not found.' });

   const deletedContact = await db.query(
    'DELETE FROM public."Contacts" WHERE 1=1 AND id = $1 RETURNING *',
    [id]
   );

   res.json({ Success: true, msg: 'Contact deleted successfully.', data: deletedContact.rows });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
