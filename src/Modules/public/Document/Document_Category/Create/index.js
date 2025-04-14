module.exports = async (req, res) => {
 const { db } = res.locals.utils;
 try {
  const fields = Object.keys(req.body);
  const $enc = fields.map((_, i) => `$${i + 1}`);

  const { rows } = await db.query(
   `INSERT INTO public."Document_Categories"(${fields}) VALUES(${$enc}) RETURNING *`,
   Object.values(req.body)
  );

  res.json({ success: true, msg: 'Document category was created successfully.', data: rows });
 } catch ({ message }) {
  res.json({ success: false, message });
 }
};
