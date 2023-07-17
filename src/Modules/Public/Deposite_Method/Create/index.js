module.exports = route => (app, db) => {
 // Create Deposite Method
 app.post(route, async (req, res) => {
  try {
   const fields = Object.keys(req.body);
   const values = Object.values(req.body);
   const enc_values = [];

   for (let i = 0; i < values.length; enc_values.push(`$${++i}`));

   const newDepositeMethod = await db.query(
    `INSERT INTO public."Deposite_Methods"(${fields}) VALUES(${enc_values}) RETURNING *`,
    values
   );
   res.json({
    success: true,
    msg: 'Deposite method created successfully.',
    data: newDepositeMethod.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
