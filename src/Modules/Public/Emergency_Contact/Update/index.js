module.exports = (app, db) => {
 // Update Emergency Contacts
 app.put('/REST/emergency_contacts', async (req, res) => {
  try {
   const { db } = res.locals.utils;
   const { id } = req.query;
   if (!id) return res.status(404).json({ Success: false, msg: 'Emergency contact not found.' });

   const changed = [];

   let i = 1;
   for (let prop in req.body) changed.push(`${prop} = $${i++}`);

   const modifiedEmergencyContact = await db.query(
    `UPDATE public."Emergency_Contacts" SET ${changed} WHERE 1=1 AND id=$${i} RETURNING *`,
    [...Object.values(req.body), id]
   );

   res.json({
    success: true,
    msg: 'Emergency contacts updated successfully.',
    data: modifiedEmergencyContact.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
