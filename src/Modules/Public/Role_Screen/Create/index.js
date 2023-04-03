module.exports = route => app => {
 // Create Role Screen[s]
 let client = null;
 app.post(route, async (req, res) => {
  try {
   const { db, isPositiveInteger, rollback } = res.locals.utils;
   const SAVEPOINT = 'fresh';
   client = await db.connect();

   const roleRollback = async message => {
    await rollback(SAVEPOINT, client);
    throw new Error(message);
   };
   const screenValues = [...new Set(req.body.screens)];

   if (0 === screenValues.length || !screenValues.every(id => isPositiveInteger(id)))
    throw new Error('Screens must be an array with at least one screen id');

   delete req.body.screens;

   const fields = Object.keys(req.body).join(',');
   const values = Object.values(req.body);
   const enc_values = [];

   for (let i = 0; i < values.length; enc_values.push(`$${++i}`));
   await client.query('BEGIN;SAVEPOINT ' + SAVEPOINT);
   const {
    rows: roleData,
    rows: [{ id: role_id }],
   } = await db.query(
    `INSERT INTO public."Roles"(${fields}) OVERRIDING SYSTEM VALUE
         VALUES(${enc_values.join(',')}) 
         ON CONFLICT(id) DO UPDATE SET 
          role         = EXCLUDED.role,
          main_page_id = EXCLUDED.main_page_id RETURNING *`.replaceAll(/\s+/g, ' '),
    values
   );

   if (null == role_id) await roleRollback('Role was not inserted [ROLLBACK].');

   const screenFields = 'Role_id, Screen_id';
   const screen_enc_values = ['$1'];
   const screenRows = [];

   let currentIndex = screen_enc_values.length;
   screenValues.forEach(_ => screenRows.push(`($1,$${++currentIndex})`));
   screenValues.unshift(role_id);

   const { rows: roleScreens } = await client.query(
    `INSERT INTO public."Role_Screens"(${screenFields}) VALUES${screenRows} RETURNING *`,
    screenValues
   );
   if (0 === roleScreens.length) await roleRollback('Role screens was not inserted [ROLLBACK].');
   await client.query('COMMIT;');

   res.json({
    success: true,
    msg: 'Role screen was created successfully.',
    data: { role: roleData, role_screens: roleScreens },
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  } finally {
   client.release();
  }
 });
};
