require('use-strict');
require('strict-mode');
"use-strict"

var express = require('express');
var app = express();

app.get('/reporters.json', function (req, res) {
  console.log('Serving reporters.json');
  res.sendFile( __dirname + "/" + "reporters.json" );
});

app.get('/miserables.json', function (req, res) {
  console.log('Serving miserables.json');
  res.sendFile( __dirname + "/" + "miserables.json" );
});


// Server

// Make the public folder accessible
app.use(express.static('public'));

// Route for the root (pun intended)
app.get('/index.html', function (req, res) {
  console.log('Serving index.html');
  res.sendFile( __dirname + "/" + "index.html" );
});


// Set up server
var server = app.listen(process.env.PORT || 8081, () => {
   console.log("Reporter Visualization listening at 8081");
});
