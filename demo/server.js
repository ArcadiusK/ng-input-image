var path = require('path');
var http = require('http');

var express = require('express');
var app = express();
var server = http.createServer();
server.on('request', app);
server.listen(8000);

app.use(express.static(path.join(__dirname, '../bower_components')));
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, '../dist')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, './index.html'));
});
