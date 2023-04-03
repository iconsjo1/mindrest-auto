module.exports = (app, db) => {
 // Delete Department
 app.delete('/REST/departments', async (req, res) => {
  try {
   const { id } = req.query;
   if (!id) return res.status(404).json({ success: false, msg: 'Department not found.' });

   const deletedDepartment = await db.query(
    'DELETE FROM public."Departments" WHERE 1=1 AND id = $1 RETURNING *',
    [id]
   );

   res.json({
    Success: true,
    msg: 'Department deleted successfully.',
    data: deletedDepartment.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
