const AWS = require('aws-sdk');
// const multer = require('multer');
const config = require('./config');

// AWS S3 Configuration
const s3 = new AWS.S3({
    forcePathStyle: false,
    region: config.aws.region,
    endpoint: 'https://nyc3.digitaloceanspaces.com', 
    credentials: {
        accessKeyId: config.aws.accessKeyId,
        secretAccessKey: config.aws.secretAccessKey
    }
  });

// const upload = multer({
//     storage: multer.memoryStorage(), // Store files in memory temporarily
//     limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10 MB
//   });

module.exports = {s3}