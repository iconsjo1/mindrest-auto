module.exports = route => (app, db) => {
 // Read Patient Service Document[s]
 app.get(route, async (req, res) => {
  try {
   const { patient_id: id } = req.query;

   const patientServiceDiscounts = id
    ? await db.query(
       'SELECT * FROM public."V_Patient_Service_Discounts" WHERE 1=1 AND patient_id=$1',
       [id]
      )
    : await db.query('SELECT * FROM public."V_Patient_Service_Discounts"');

   res.json({
    success: true,
    msg: `Patient service discount${
     1 === patientServiceDiscounts.rows.length ? '' : 's'
    } retrieved successfully.`,
    data: patientServiceDiscounts.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
