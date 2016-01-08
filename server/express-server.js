var express = require("express");
var app = express();
var ip = "127.0.0.1";
var port = 3000;
var handleRequest = require('./request-handler.js');

app.use(express.static("/Users/student/Documents/2015-06-chatterbox-server/chatterbox-client/client"));

app.get('/:room', handleRequest.requestHandler);
app.post('/:room', handleRequest.requestHandler);

app.listen(process.env.PORT || 3000);