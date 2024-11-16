const AWS = require('aws-sdk');
const multer = require('multer');
const config = require('./config');

// AWS S3 Configuration
const s3 = new AWS.S3({
    region: config.aws.region,
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
  });

const upload = multer({
    storage: multer.memoryStorage(), // Store files in memory temporarily
    limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10 MB
  });

module.exports = {s3, upload}