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
  origin: process.env.TRUSTED_ORIGIN,
  urlvars: [config.database.id_colname, "participant","project","experiment","condition","researcher","sourcedb","location"]
}
