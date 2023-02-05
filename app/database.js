const config = require('./config')
const { Pool } = require('pg')
const connectionString = config.database.connectionstring

// connect to the database 
const pool = new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: true, 
      //ca: config.database.ca
  },
  })

module.exports = pool