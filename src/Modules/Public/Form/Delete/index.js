module.exports = (app, db) => {
 // Delete Form
 app.delete('/REST/forms', async (req, res) => {
  try {
   const { db } = res.locals.utils;

   const { id } = req.query;
   if (!id) return res.status(404).json({ success: false, msg: 'Form not found.' });

   const deletedForm = await db.query(
    'DELETE FROM public."Forms" WHERE 1=1 AND id = $1 RETURNING *',
    [id]
   );

   res.json({ Success: true, msg: 'Form deleted successfully.', data: deletedForm.rows });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
