const config = require('./config')
const pool = require('./database')
const router = require('express').Router()
const { requestValidationRules, validateRequest  } = require('./validate')
const transformData  = require('./transform')
const getPresignedPost = require('./s3uploader')

function upsertData (req, res) {

    // transform the pcibex data into the format our database prefers
    const data = transformData(req.body, req.query)
    
    // pull out the columns and their indexes so we can pass them to the query more easily
    const columns = Object.keys(data)
    const indexes = Object.keys(data).map((value, index) => `$${index+1}`);
    const data_col_index = columns.indexOf(config.database.data_colname)+1

    console.log(data_col_index)

    // setup the insert query for pg 
    const query = {
      name: 'create-run',
      text: `INSERT INTO ${config.database.table}(${columns}) VALUES(${indexes})
             ON CONFLICT (${config.database.id_colname}) DO UPDATE SET data = $${data_col_index} RETURNING *`,
      values: Object.values(data)
    }

    // callback function to run the query 
    pool.query(query, (error, result) => {
      if (error) { res.status(403).send(error) } 
      else { res.status(201).send(result.rows)}
     
    })
}

router.post('/v1/runs/pcibex',  requestValidationRules(), validateRequest, upsertData)
router.post('/v1/recordings/pcibex', getPresignedPost())

module.exports = router