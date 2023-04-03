module.exports = (app, db) => {
 // Delete Emergency Contact
 app.delete('/REST/emergency_contacts', async (req, res) => {
  try {
   const { id } = req.query;
   if (!id) return res.status(404).json({ success: false, msg: 'Emergency contact not found.' });

   const deletedEmergencyContact = await db.query(
    'DELETE FROM public."Emergency_Contacts" WHERE 1=1 AND id = $1 RETURNING *',
    [id]
   );

   res.json({
    Success: true,
    msg: 'Emergency contact deleted successfully.',
    data: deletedEmergencyContact.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
