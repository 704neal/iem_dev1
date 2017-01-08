require('dotenv').config();
var express = require('express');
var p = require('./particle_init.js');

// console.log('Particle?   ***\n\n', p);



var app = express();





app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.get('/neal', function (req, res) {
  res.send('Hello Neal!')
})


// starts the server, accessible on port 300, http://localhost:3000/  or http://127.0.0.1:3000/
app.listen(3000, function () {
  // console.log('Example app listening on port 3000!!!!!!!!!!')
})
