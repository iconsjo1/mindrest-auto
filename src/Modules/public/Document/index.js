const { S3Client } = require('@aws-sdk/client-s3');
const multer = require('multer');

module.exports = app => {
 const documents = '/REST/documents';
 const do_documents = '/REST/do_documents';
 const cat = '/REST/document_categories';

 const multerSingleMiddleware = multer({ storage: multer.memoryStorage() }).single('file');

 const aws_do = (_, res, next) => {
  res.locals.do = {
   bucket: 'icon',
   folder: 'Mind',
   getS3() {
    const region = 'eu2';
    return new S3Client({
     endpoint: `https://${region}.contabostorage.com`,
     forcePathStyle: true,
     region,
     credentials: {
      accessKeyId: '973ed6064ca7b2b632e92ddab9fde782',
      secretAccessKey: '653c20a890739359c769972daf61b948',
     },
    });
   },
  };

  next();
 };

 // Home
 const homeControllers = require('./Home');
 app.post(do_documents, [aws_do, multerSingleMiddleware], homeControllers.createController);
 app.get(documents, homeControllers.readController);
 app.get(do_documents, aws_do, homeControllers.readDOController);
 app.delete(do_documents, aws_do, homeControllers.deleteController);

 // cat
 const catControllers = require('./Document_Category');

 app.post(cat, catControllers.createController);
 app.get(cat, catControllers.readController);
 app.put(cat, catControllers.updateController);
 app.delete(cat, catControllers.deleteController);
};
