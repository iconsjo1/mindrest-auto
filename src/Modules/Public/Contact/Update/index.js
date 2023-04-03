module.exports = (app, db) => {
 // Update Contact
 app.put('/REST/contacts', async (req, res) => {
  try {
   const { id } = req.query;
   if (!id) return res.status(404).json({ Success: false, msg: 'Contact not found.' });

   const modifiedData = [];

   let i = 1;
   for (let prop in req.body) modifiedData.push(`${prop} = $${i++}`);

   const modifiedContact = await db.query(
    `UPDATE public."Contacts" SET ${modifiedData.join(',')} WHERE 1=1 AND id=$${i} RETURNING *`,
    [...Object.values(req.body), id]
   );

   res.json({ success: true, msg: 'Contact updated successfully.', data: modifiedContact.rows });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
