require('dotenv').config();

// to simplify things, all variables from .env files are used here 
const config = module.exports
const PRODUCTION = process.env.NODE_ENV === 'production'

config.express = {
  port: process.env.EXPRESS_PORT || 3000,
  ip: '0.0.0.0'
}

config.database = { 
  connectionstring: process.env.CONNECTION_STRING,
  ca: process.env.CA_CERT,
  table: process.env.POSTGRES_TABLE,
  id_colname: process.env.COLNAME_ID,
  data_colname: process.env.COLNAME_DATA,
}

config.validation = {
  origin: process.env.TRUSTED_ORIGIN,
  urlvars: [config.database.id_colname, "participant","project","experiment","condition","researcher","sourcedb","location"]
}
if (PRODUCTION) {
  // for example
  config.express.ip = '0.0.0.0'
}
