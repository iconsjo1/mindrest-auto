module.exports = (app, db) => {
 // Delete Country
 app.delete('/REST/countries', async (req, res) => {
  try {

    const { db } = res.locals.utils;
   const { id } = req.query;
   if (!id) return res.status(404).json({ success: false, msg: 'Country not found.' });

   const deletedCountry = await db.query(
    'DELETE FROM public."Countries" WHERE 1=1 AND id = $1 RETURNING *',
    [id]
   );

   res.json({ Success: true, msg: 'Country deleted successfully.', data: deletedCountry.rows });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
