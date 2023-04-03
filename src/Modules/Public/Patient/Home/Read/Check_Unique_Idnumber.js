module.exports = route => (app, db) => {
 // Check UNIQUE IDNUMBER
 app.get(route, async (req, res) => {
  try {
   const { idnumber: idNumber } = req.query;
   if (!idNumber) return res.json({ success: false, msg: 'ID-NUMBER not porovided.' });

   const idNumber_exists = await db.query(
    'SELECT * FROM public."Patients" WHERE 1=1 AND patient_national_idnumber=$1',
    [idNumber]
   );
   const result = 0 === idNumber_exists.rows.length;
   res.json({
    success: true,
    msg: `ID-NUMBER ${result ? 'does not exist' : 'exists'}`,
    result,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
