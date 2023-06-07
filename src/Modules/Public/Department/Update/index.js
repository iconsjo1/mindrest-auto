module.exports = (app, db) => {
 // Update Department
 app.put('/REST/departments', async (req, res) => {
  try {
   const { id } = req.query;
   if (!id) return res.status(404).json({ Success: false, msg: 'Deparatment not found.' });
   const changed = [];

   let i = 1;
   for (let prop in req.body) changed.push(`${prop} = $${i++}`);

   const modifiedDepartment = await db.query(
    `UPDATE public."Departments" SET ${changed} WHERE 1=1 AND id=$${i} RETURNING *`,
    [...Object.values(req.body), id]
   );
   res.json({
    success: true,
    msg: 'Department updated successfully.',
    data: modifiedDepartment.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
