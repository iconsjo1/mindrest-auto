const { Readable } = require('node:stream');
module.exports = stream => {
 return new Promise((resolve, reject) => {
  if (!(stream instanceof Readable)) return reject(Error('Not a valid stream.'));

  const bufs = [];
  stream.on('data', chunk => bufs.push(chunk));
  stream.on('error', err => reject(err));
  stream.on('end', () => resolve(Buffer.concat(bufs)));
 });
};
