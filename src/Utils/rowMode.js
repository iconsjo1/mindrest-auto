module.exports = (query, values = []) => ({ text: query, values, rowMode: 'array' });
