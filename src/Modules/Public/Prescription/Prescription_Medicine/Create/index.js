module.exports = route => (app, db) => {
 // UPSERT Prescription Medicine
 app.post(route, async (req, res) => {
  try {
   const { isPositiveNumber, isPositiveInteger, isSQLDate } = res.locals.utils;

   const { medicine_list } = req.body;

   if (!Array.isArray(medicine_list) || 0 === medicine_list.length)
    return res.json({ success: false, msg: 'Medicine list is not submitted correctly.' });

   delete req.body.medicine_list;

   const fields =
    Object.keys(req.body) +
    ', medicine_id, morning, afternoon, evening, anytime, medicine_to_food_id ,start_date, end_date';
   const values = Object.values(req.body);
   const enc_values = [];

   for (let i = 0; i < values.length; enc_values.push(`$${++i}`));

   const rows = [];
   let currIndexIncrement = enc_values.length;

   for (const medicine of medicine_list) {
    const {
     medicine_id,
     morning,
     afternoon,
     evening,
     anytime,
     medicine_to_food_id,
     start_date,
     end_date,
    } = medicine;

    if (
     !isPositiveInteger(medicine_id) ||
     (null != morning && !isPositiveNumber(morning)) ||
     (null != afternoon && !isPositiveNumber(afternoon)) ||
     (null != evening && !isPositiveNumber(evening)) ||
     (null != anytime && !isPositiveNumber(anytime)) ||
     !isPositiveInteger(medicine_to_food_id) ||
     !isSQLDate(start_date) ||
     !isSQLDate(end_date)
    )
     throw new Error(
      'Medicine number {' + (medicine_list.indexOf(medicine) + 1) + '} is not valid'
     );

    const medicinePropCount = Object.keys({
     morning,
     afternoon,
     evening,
     anytime,
     ...medicine,
    }).length;

    for (let i = 0; i++ < medicinePropCount; enc_values.push(`$${++currIndexIncrement}`));

    rows.push(`(${enc_values})`);

    // Initialize new row
    enc_values.splice(0 - medicinePropCount, medicinePropCount); // remove items to reset counter
    values.push(
     medicine_id,
     morning,
     afternoon,
     evening,
     anytime,
     medicine_to_food_id,
     start_date,
     end_date
    );
   }
   const { rows: insertedRows } = await db.query(
    `INSERT INTO public."Prescription_Medicines"(${fields}) VALUES${rows} RETURNING *`,
    values
   );

   res.json({
    success: true,
    msg: `Prescription medicine${1 === insertedRows.length ? '' : 's'} created successfully.`,
    data: insertedRows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
