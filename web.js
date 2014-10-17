(function (undefined) {
  'use strict';

  var express = require("express");
  var logfmt = require("logfmt");
  var url = require('url');
  var app = express();

  var fileOptions = {
    root: __dirname
  };

  //middleware
  app.use(logfmt.requestLogger());
  app.use('/edit', express.static(__dirname + '/client/edit-challenge'));
  app.use('/manage', express.static(__dirname + '/client/manage-challenge'));

  //server side routes
  app.get('/', function (req, res) {
    res.redirect('/manage/');
  });

  app.get('/manage', function (req, res) {
    res.sendFile('client/manage-challenge/index.html', fileOptions, handleFileError);
  });

  app.get('/edit', function (req, res) {
    res.sendFile('client/edit-challenge/index.html', fileOptions, handleFileError);
  });

  //server config
  var port = Number(process.env.PORT || 8000);

  app.listen(port, function () {
    console.log("Listening on " + port);
  });

  //helper functions
  function handleFileError(err) {
    if (err) {
      console.log(err);
      console.log("Unable to serve file");
    }
  }
})();