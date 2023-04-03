module.exports = dateStr =>
 !Number.isNaN(new Date(dateStr).getTime()) && /^\d{4}-\d{1,2}-\d{1,2}$/.test(dateStr);
