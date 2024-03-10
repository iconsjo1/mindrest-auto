module.exports = route => app => {
 // UPSERT Holiday[s]
 app.post(route, async (req, res) => {
  try {
   const dateSort = (a, b) => new Date(b).getTime() - new Date(a).getTime();

   const { db, isSQLDate, isIterable } = res.locals.utils;

   const { holidays } = req.body;

   const holidaysArray = isIterable(holidays)
    ? Array.from([...new Set(holidays)].filter(isSQLDate)).sort(dateSort)
    : [];

   if (0 === holidaysArray.length)
    return res.status(400).json({ success: false, msg: 'no holidays were successfully submitted.' });

   const values = [];
   const enc_values = [];
   const rows = [];
   let currentIndex = enc_values.length;

   for (const d of holidaysArray) {
    rows.push(`($${++currentIndex})`);
    values.push(d);
   }

   const insertedRows = await db
    .query({
     text: `INSERT INTO public."Holidays"(date) 
            VALUES${rows} 
            ON CONFLICT DO NOTHING
            RETURNING (id,date)`.replace(/\s+/g, ' '),
     values,
     rowMode: 'array',
    })
    .then(({ rows }) =>
     rows.flatMap(([row]) => {
      const vars = row.replace(/[\(\)]/g, '').split(',');
      return { id: vars[0], date: vars[1] };
     })
    );

   res.json({
    success: true,
    no_of_records: insertedRows.length,
    msg: `Holiday${1 === insertedRows.length ? ' was' : 's were'} created successfully${
     0 === insertedRows.length ? ' [duplicate]' : ''
    }.`,
    data: insertedRows.sort(dateSort),
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
