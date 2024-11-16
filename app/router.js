const config = require('./config')
const pool = require('./database')
const router = require('express').Router()
const { pcibexValidationRules, jspsychValidationRules, validateRequest  } = require('./validate')
const transformData  = require('./transform')
const { s3, upload } = require('./s3')

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

function upsertJspsychData (req, res){

   // stringify the data from jspsych
   const data = req.body;
   data.data = data.data;
   
  //  pull out the columns and their indexes so we can pass them to the query more easily
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


  // res.send({
  //   response: "You are trying to create a run!"
  // })

}

function uploadToS3 (req, res){
  console.log(req.body); // check if the base64 string is sent

  const {file} = req.body; 

  if (!file){
    return res.status(400).json({message: 'No file provided'})
  }

  const buffer = Buffer.from(file, 'base64'); 

  const params = {
    Bucket: config.aws.bucketName, // Your bucket name
    Key: `${Date.now()}.wav`, // Unique file name
    Body: buffer, // File content
    ContentType: 'audio/wav', // File MIME type
    ACL: 'public-read', // Optional: Make file publicly readable
  };

  s3.upload(params, (err, data) => {
    if (err) {
      console.error('Error uploading to s3:', err); 
    } 
    res.json({message: 'File uploaded successfully', fileUrl: data.Location}); 
  })
};

router.post('/v1/runs/pcibex',  pcibexValidationRules(), validateRequest, upsertData)
router.post('/v1/runs/jspsych', jspsychValidationRules(), validateRequest, upsertJspsychData) 

// Route for File Upload
router.post('/v1/upload', uploadToS3)
  // try {
  //   const file = req.file;
  //   if (!file) {
  //     return res.status(400).send({ error: 'No file provided' });
  //   }

  //   const result = await uploadToS3(file); // Upload to S3
  //   res.status(200).send({ message: 'File uploaded successfully', data: result });
  // } catch (error) {
  //   console.error('Error uploading file:', error);
  //   res.status(500).send({ error: 'Failed to upload file' });
  // }
// });


module.exports = router