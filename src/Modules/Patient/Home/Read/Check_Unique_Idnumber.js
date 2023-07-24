module.exports = route => app => {
 // Check UNIQUE IDNUMBER
 app.get(route, async (req, res) => {
  try {
   const { db, isPositiveInteger } = res.locals.utils;

   const { idnumber: idNumber } = req.query;
   if (!isPositiveInteger(idNumber))
    return res.json({ success: false, msg: 'ID-NUMBER not a positive integer.' });

   const hasMatch = await db
    .query({
     text: 'SELECT true FROM public."Patients" WHERE 1=1 AND patient_national_idnumber=$1',
     values: [idNumber],
     rowMode: 'array',
    })
    .then(({ rows }) => 0 < rows.length);

   res.json({
    success: true,
    msg: `ID-NUMBER ${hasMatch ? 'does not exist' : 'exists'}`,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
