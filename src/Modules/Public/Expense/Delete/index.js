module.exports = route => (app, db) => {
 // Delete Expense
 app.delete(route, async (req, res) => {
  try {
    const { db,isPositiveInteger} = res.locals.utils;

   const { id } = req.query;
   if (!isPositiveInteger(id))
    return res.status(404).json({ success: false, msg: 'Expense not found.' });

   const { rows } = await db.query(
    'DELETE FROM public."Expenses" WHERE 1=1 AND id = $1 RETURNING *',
    [id]
   );

   res.json({ Success: true, msg: 'Expense deleted successfully.', data: rows });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
