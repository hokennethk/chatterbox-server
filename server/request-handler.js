var fs = require('fs');
var express = require('express');
var expressApp = express();

var requestHandler = function(request, response) {
  var results = [];
  console.log("Serving request type " + request.method + " for url " + request.url);
  var statusCode;

  var headers = defaultCorsHeaders;
  headers['Content-Type'] = "text/plain";
  var writeHead = function(statusCode){
    response.writeHead(statusCode, headers);
  }

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
    if(request.method === 'OPTIONS'){
      writeHead(200);
      response.end();
    }
    if (request.method === 'GET'){
      var route = request.url;
      writeHead(200);
      fs.readFile('server/results.txt', function(err, data){
        if (err) throw err;
        results = JSON.parse(data);
        var obj = {results: results};
        var stringified = JSON.stringify(obj);
        response.end(stringified);
      })
    }

    if (request.method === 'POST'){
      writeHead(201);
      var requestBody = '';
      // results.push(request.json);
      request.on('data', function(chunk) {
        console.log(chunk);
        requestBody += chunk;
      });

      request.on('end', function() {
        console.log('request ended');
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
};

var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept, X-Parse-Application-Id, X-Parse-REST-API-Key",
  "access-control-max-age": 10 // Seconds.
};

exports.requestHandler = requestHandler;
exports.defaultCorsHeaders = defaultCorsHeaders;

