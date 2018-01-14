var cool = require('cool-ascii-faces');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var pg = require('pg');
var io = require('socket.io')(http);

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
http.listen(app.get('port'),function(){console.log('Node app is running on port', app.get('port'));});

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
//require the attached modules for the app to run
require('./lib/router')(app);  
require('./lib/chat_module')(app,io);