const config = require('./config')
const { Pool } = require('pg')
const fs = require('fs')
const path = require('path');

// connect to the database 
const pool = new Pool({
  user: config.database.user,
  host: config.database.host,
  database: config.database.database,
  password: config.database.password,
  port: config.database.port,
  ssl: {
    rejectUnauthorized: true,
    ca: config.database.ca,
  },
})

module.exports = pool