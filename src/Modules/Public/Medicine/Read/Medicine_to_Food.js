module.exports = (app, db) => {
 // Read Medicine[s]
 app.get('/REST/medicine_to_foods', async (req, res) => {
  try {
   const { id } = req.query;

   const medicineToFoods = id
    ? await db.query(
       'SELECT id,time_desc || \' food\' food_relation FROM public."Medicine_to_Foods" WHERE 1=1 AND id=$1',
       [id]
      )
    : await db.query(
       'SELECT id,time_desc || \' food\' food_relation FROM public."Medicine_to_Foods"'
      );

   res.json({
    success: true,
    msg: `Medicine to food${1 === medicineToFoods.rows.length ? '' : 's'} retrieved successfully.`,
    data: medicineToFoods.rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
