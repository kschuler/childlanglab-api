const config = require('./config')
const { Pool } = require('pg')
const fs = require('fs')
const path = require('path');
const connectionString = config.database.connectionstring

// connect to the database 
const pool = new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: true, 
      ca: fs.readFileSync(path.resolve('././certs/ca-certificate.crt')).toString(),


  },
  })

module.exports = pool