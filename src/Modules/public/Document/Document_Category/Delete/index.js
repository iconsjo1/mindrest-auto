module.exports = async (req, res) => {
 const { db, isPositiveInteger } = res.locals.utils;

 try {
  const { id } = req.query;
  if (!isPositiveInteger(id)) return res.status(404).json({ success: false, msg: 'Document category was not found.' });

  const { rows } = await db.query('DELETE FROM public."Document_Categories" WHERE 1=1 AND id = $1 RETURNING *', [id]);

  res.json({ Success: true, msg: 'Document category was deleted successfully.', data: rows });
 } catch (error) {
  res.json({ success: false, msg: error.message });
 }
};
