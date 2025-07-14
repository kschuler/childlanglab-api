require('dotenv').config();

// to simplify things, all variables from .env files are used here 
const config = module.exports

config.express = {
  port: process.env.EXPRESS_PORT || 3000,
  ip: '0.0.0.0'
}

config.database = { 
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOSTNAME,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ca: process.env.CA_CERT,
  table: process.env.POSTGRES_TABLE,
  id_colname: process.env.COLNAME_ID,
  data_colname: process.env.COLNAME_DATA,
}

config.validation = {
  origins:  ["https://upenn.pcibex.net", "https://nyc3.digitaloceanspaces.com", "https://pennchildlanglab.github.io", "https://rjsnider.github.io/"],
  urlvars: [config.database.id_colname, "participant","expid", "versionid", "condition","researcher","sourcedb","location"]
}

config.aws = {
  region: process.env.AWS_REGION || 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  bucketName: process.env.S3_BUCKET_NAME
}