/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
// require fs to read html/css/js files
var fs = require('fs');
var express = require('express');
var expressApp = express();


// var results = [{username: "Alpha", text: "And on the first day... there was a message", roomname: "lobby"}];


var requestHandler = function(request, response) {
  var results = [];
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log("Serving request type " + request.method + " for url " + request.url);
  // The outgoing status.

  var statusCode;

  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  headers['Content-Type'] = "text/plain";
  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.\
  var writeHead = function(statusCode){
    response.writeHead(statusCode, headers);
  }

  // filter 'root' to serve files
  if (request.url === '/') {
    // console.log('root')
    // var dir = './chatterbox-client/';
    // // expressApp.use(express.static(dir));

    // response.writeHead(200, {'Content-Type' : 'text/html'});
    // response.end(dir + 'client/index.html')
    // // fs.readFile(dir, function (err,data) {
    //     if (err) {
    //       response.writeHead(404);
    //       console.log("--- ERROR SERVING FILES ----")
    //       response.end(JSON.stringify(err));
    //       return;
    //     }
    //     response.writeHead(200);
    //     console.log("--- SERVING FILES ----")
    //     response.end(data);
    //   });
  } 
  // else if (request.url.indexOf("classes") !== -1){
    if(request.method === 'OPTIONS'){
      writeHead(200);
      response.end();
    }
    if (request.method === 'GET'){
      var route = request.url;
      console.log(" ---- URL NAME ---- ", route);
      console.log(" ---- REQUEST.PARAMS NAME ---- ", request.params.room);
      writeHead(200);
      fs.readFile('server/results.txt', function(err, data){
        if (err) throw err;
        results = JSON.parse(data);
        // _.filter(results, function(result){
        //   return result.roomname === route.substr(1);
        // }
        // console.log(results);
        var obj = {results: results};
        var stringified = JSON.stringify(obj);
        // console.log(stringified);
        // console.log("MESSAGE ARRAY", obj.results)
        response.end(stringified);
      })
    }

    if (request.method === 'POST'){
      writeHead(201);
      var requestBody = '';
      // results.push(request.json);
      //console.log("request: ", Object.keys(request));
      // console.log("client: ", request.client);
      request.on('data', function(chunk) {
        console.log(chunk);
        requestBody += chunk;
      });

      request.on('end', function() {
        console.log('request ended');
        // console.log(requestBody);
        requestBody = JSON.parse(requestBody);
        requestBody.objectId = Math.random();
        requestBody.createdAt = new Date();
        fs.readFile('server/results.txt', function(err, data){
          if (err) throw err;
          results = JSON.parse(data);
          console.log(" -- RESULTS ON POST -- ", results);
          results.push(requestBody);
          var data = JSON.stringify(results);
          fs.writeFile('server/results.txt',data,function(err){
            if (err) return console.log(err);
            response.end();
          });
        });
      })
    }
  // } 
  // else {
  //   writeHead(404);
  //   console.log(" ----   UNKNOWN URL   ---- : ", request.url);
  //   response.end();
  // }
  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept, X-Parse-Application-Id, X-Parse-REST-API-Key",
  "access-control-max-age": 10 // Seconds.
};

exports.requestHandler = requestHandler;
exports.defaultCorsHeaders = defaultCorsHeaders;

