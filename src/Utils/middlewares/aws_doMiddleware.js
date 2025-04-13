const { S3Client } = require('@aws-sdk/client-s3');

const aws_do = (_, res, next) => {
 res.locals.do = {
  bucket: 'icon',
  folder: 'Mind',
  fileDIR: 'files',
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

module.exports = aws_do;
