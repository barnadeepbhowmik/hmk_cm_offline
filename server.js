var express = require('express'),
 http = require('http'),
 path = require('path');
var url = require("url");
  
 //Congifure eXxpress
var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.use(express.favicon());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('Cookies'));
    app.use(express.session());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, '/')));
    app.use(function(req, res) {
     // Use res.sendfile, as it streams instead of reading the file into memory.
         res.sendfile(__dirname + '/index.html');
    });
});

app.configure('development', function () {
    app.use(express.errorHandler());
});

//start the Server
http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});