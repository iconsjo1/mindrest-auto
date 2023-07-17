const { isPositiveInteger, isEString } = require('../../../../Utils');

module.exports = route => (app, db) => {
 // UPSERT Bill Service[s]
 app.post(route, async (req, res) => {
  try {
   const { service_list } = req.body;
   if (!Array.isArray(service_list) || 0 === service_list.length)
    return res.json({ success: false, msg: 'Service list is not submitted correctly.' });

   delete req.body.service_list;

   const fields = Object.keys(req.body);
   const values = Object.values(req.body);
   const enc_values = [];

   for (let i = 0; i < values.length; enc_values.push(`$${++i}`));

   const rows = [];
   let currIndexIncrement = enc_values.length;

   for (let service of service_list) {
    const serviceProps = {
     no_of_sessions: 1,
     notes: null,
     ...service,
    };

    const { service_id, no_of_sessions, notes } = serviceProps;
    if (!isPositiveInteger(service_id) || !isEString(notes) || !isPositiveInteger(no_of_sessions))
     throw new Error('Bill service {' + (service_list.indexOf(service) + 1) + '} is not valid');

    const billServicePropCount = Object.keys(serviceProps).length;

    // ($1,$2,$3,$4),($1,$5,$6,$7)
    for (let i = 0; i++ < billServicePropCount; enc_values.push(`$${++currIndexIncrement}`));

    rows.push(`(${enc_values})`);

    // Initialize new row
    enc_values.splice(0 - billServicePropCount, billServicePropCount); // remove items to reset counter
    values.push(service_id, no_of_sessions, notes);
   }
   const { rows: insertedRows } = await db.query(
    `INSERT INTO public."Bill_Services"(${fields},service_id,no_of_sessions,notes) VALUES${rows} RETURNING *`.replace(/\s+/g, ' '),
    values
   );

   res.json({
    success: true,
    msg: `Bill service${1 === insertedRows.length ? '' : 's'} created successfully.`,
    data: insertedRows,
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
