module.exports = route => app => {
 // Update Department
 app.put(route, async (req, res) => {
  let client = null;
  let begun = false;
  try {
   const {
    db,
    isPositiveInteger,
    SQLfeatures,
    env: { EVENT },
   } = res.locals.utils;
   const { user_id } = res.locals;

   const { id } = req.query;
   if (!isPositiveInteger(id)) return res.status(404).json({ Success: false, msg: 'Department was not found.' });

   const updateFilters = { id };

   delete req.body.is_deleted; // Manual operation is prohibited.
   delete req.body.teller; // Manual operation is prohibited.

   const { sets, values, filters } = SQLfeatures.update({ filters: updateFilters, ...req.body });

   client = await db.connect();
   await client.query('BEGIN').then(() => (begun = true));

   const { rows } = await client.query(`UPDATE public."Departments" SET ${sets} WHERE ${filters} RETURNING *`, values);

   if (0 < rows.length && null != rows[0].teller)
    await client.query(`INSERT INTO story."Events"(${EVENT.COLUMNS}) SELECT ${EVENT.ENC}`, [
     rows[0].teller,
     user_id,
     EVENT.TYPE.UPDATE,
    ]);

   await client.query('COMMIT').then(() => (begun = false));
   res.json({
    success: true,
    msg: 'Department was updated successfully.',
    data: rows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  } finally {
   if (null != client) {
    if (true === begun) {
     try {
      await client.query('ROLLBACK');
     } catch ({ message: rmessage }) {
      throw Error(rmessage);
     }
    }
    client.release();
   }
  }
 });
};
