module.exports = route => (app, db) => {
 // UPSERT Prescription Medicine
 app.post(route, async (req, res) => {
  try {
   const { db, isPositiveInteger, isSQLDate, isValidObject, isPositiveNumber } = res.locals.utils;

   const { prescription_id, medicine_list } = req.body;

   if (!isPositiveInteger(prescription_id))
    return res
     .status(400)
     .json({ success: false, msg: 'prescription_id is not a positive integer.' });

   if (
    !Array.isArray(medicine_list) ||
    0 === medicine_list.length ||
    !medicine_list.every(
     m =>
      isValidObject(m) &&
      isPositiveInteger(m.medicine_id) &&
      isPositiveNumber(m.morning) &&
      isPositiveNumber(m.afternoon) &&
      isPositiveNumber(m.evening) &&
      isPositiveNumber(m.anytime) &&
      isPositiveInteger(m.medicine_to_food_id) &&
      isSQLDate(m.start_date) &&
      isSQLDate(m.end_date)
    )
   )
    return res
     .status(400)
     .json({ success: false, msg: 'Medicine list is not submitted correctly.' });

   const fields = [
    'prescription_id',
    'medicine_id',
    'morning',
    'afternoon',
    'evening',
    'anytime',
    'medicine_to_food_id',
    'start_date',
    'end_date',
   ];
   const values = [prescription_id];
   const enc_values = ['$1'];

   const rows = [];
   let currIndex = enc_values.length;

   for (const m of medicine_list) {
    rows.push(`(${enc_values},${Array.from({ length: 8 }, _ => `$${++currIndex}`)})`);
    values.push(
     m.medicine_id,
     m.morning,
     m.afternoon,
     m.evening,
     m.anytime,
     m.medicine_to_food_id,
     m.start_date,
     m.end_date
    );
   }

   const { rows: insertedRows } = await db.query(
    `INSERT INTO public."Prescription_Medicines"(${fields}) VALUES${rows} RETURNING *`,
    values
   );

   res.json({
    success: true,
    msg: `Prescription medicine${
     1 === insertedRows.length ? ' was' : 's were'
    } created successfully.`,
    data: insertedRows.sort((a, b) => parseInt(b.id) - parseInt(a.id)),
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
