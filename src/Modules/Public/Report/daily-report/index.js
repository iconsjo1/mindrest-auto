const { isPositiveInteger, getLimitClause } = require('../../../../Utils');

module.exports = route => (app, db) => {
 // Read Relationship[s]
 app.get(route, async (req, res) => {
  try {
   const { rows: Patient_Deposites } = await db.query('SELECT * FROM public."V_Patient_Deposites"');

   const { rows: Expenses } = await db.query('SELECT * FROM public."V_Expenses"');

   res.json({
    success: true,
    msg: `V_daily_report were retrieved successfully.`,
    data: { Patient_Deposites, Expenses },
   });
  } catch ({ message }) {
   res.json({ success: false, message });
  }
 });
};
