'use strict'

const express = require('express')
const cors = require('cors')
const config = require('./config')

// Create a new instance of express
const app = express()

// PCIbex sends request as text/html; tell express to expect this
app.use(express.json({type: 'text/html', limit: '50mb'}));

app.use(cors({
  origin: config.validation.origin
}));

app.get('/', (req, res) => {
  res.send({
    response: "Welcome to the childlanglab database api! You don't have permission to use this endpoint."
})
})

// use our route: /v1/runs/pcibex n the router.js 
app.use('/', require('./router.js'))

app.use(function(req,res){
  res.status(404).send({error: 'route not found'});
});

// tell express to lisson on the correct port/ip as defined in env file
app.listen(config.express.port, config.express.ip, function (error) {
    if (error) {
      console.error('Unable to listen for connections', error)
      process.exit(10)
    } 
      console.log('express is listening on http://' + config.express.ip + ':' + config.express.port)
  });