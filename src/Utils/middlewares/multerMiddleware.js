const multer = require('multer');

const multerAnyMiddleware = multer({ storage: multer.memoryStorage() }).any();
const multerSingleMiddleware = multer({ storage: multer.memoryStorage() }).single('file');

module.exports = { multerSingleMiddleware, multerAnyMiddleware };
