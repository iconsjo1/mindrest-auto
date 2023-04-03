module.exports = route => (app, db) => {
 // Delete Deposite Method
 app.delete(route, async (req, res) => {
  try {
   const { id } = req.query;
   if (!id) return res.status(404).json({ success: false, msg: 'Deposite method not found.' });

   const deletedDepositeMethod = await db.query(
    'DELETE FROM public."Deposite_Methods" WHERE 1=1 AND id = $1 RETURNING *',
    [id]
   );

   res.json({
    Success: true,
    msg: 'Deposite method deleted successfully.',
    data: deletedDepositeMethod.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
