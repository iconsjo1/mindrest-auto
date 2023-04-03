module.exports = route => (app, db) => {
 // Create User
 app.post(route, async (req, res) => {
  try {
   const { email } = req.body;
   if (email) {
    const user = await db.query(
     'SELECT CONCAT_WS(\' \', user_first_name, user_middle_name, user_last_name) name, id FROM public."Users" WHERE 1=1 AND email = $1',
     [email]
    );

    if (0 === user.rows.length) {
     // Email is unique do insert

     const fields = Object.keys(req.body).join(',');
     const values = Object.values(req.body);
     const enc_values = [];

     for (let i = 0; i < values.length; enc_values.push(`$${++i}`));

     const newUser = await db.query(
      `INSERT INTO public."Users"(${fields}) VALUES(${enc_values.join(',')}) RETURNING *`,
      values
     );

     return res.json({ success: true, msg: 'User created successfully.', data: newUser.rows });
    }
    // Email is not unique and/or it may be used.
    const { id: user_id, name: user_actual_name } = user.rows[0];

    if (user_id) {
     const patient = await db.query('SELECT id from public."Patients" WHERE 1=1 AND user_id = $1', [
      user_id,
     ]);
     if (1 === patient.rows.length) {
      return res.json({
       success: false,
       msg: `Duplicate email for patient (${user_actual_name}) with id (${patient.rows[0].id})`,
      });
     }
     const doctor = await db.query('SELECT id from public."Doctors" WHERE 1=1 AND user_id = $1', [
      user_id,
     ]);
     if (1 === doctor.rows.length) {
      return res.json({
       success: false,
       msg: `Duplicate email for doctor (${user_actual_name}) with id (${doctor.rows[0].id})`,
      });
     }
     return res.json({
      success: false,
      msg: `This user (${user_actual_name}) id=(${user_id}) email not unique or isn\'t assigned to a patient/doctor`,
     });
    }
   }
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
