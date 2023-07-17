module.exports = (app, db) => {
 // Create Contact
 app.post('/REST/contacts', async (req, res) => {
  try {

    const { db } = res.locals.utils;

   const fields = Object.keys(req.body);
   const values = Object.values(req.body);
   const enc_values = [];

   for (let i = 0; i < values.length; enc_values.push(`$${++i}`));
   const newContact = await db.query(
    `INSERT INTO public."Contacts"(${fields}) VALUES(${enc_values}) RETURNING *`,
    values
   );

   res.json({ success: true, msg: 'Contact created successfully.', data: newContact.rows });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
