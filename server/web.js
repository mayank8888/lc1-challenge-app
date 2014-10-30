(function (undefined) {
  'use strict';

  var express = require("express");
  var logfmt = require("logfmt");
  var url = require('url');
  var app = express();
  var bodyParser = require('body-parser');
  var passport = require('passport');

  var fileOptions = {
    root: __dirname //+ '/../client'
  };

  //NOTE: Order of app.use() matters; first one wins

  //middleware
  // app.use(logfmt.requestLogger());

  //TODO: this should not be at the root level; should be at the module level
  app.use(bodyParser.json());
  app.use(passport.initialize());

  app.use(function(err, req, res, next) {
    console.log('get all handler this first?')
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

    console.log('in this thingy...11', fullUrl);
    console.log('in this thingy...11', encodeURIComponent(fullUrl));
    // console.log('in this thingy...2', res);
    // console.log('in this thingy...3', req);
    console.log('in this thingy...41', err);
    if (err.constructor.name === 'UnauthorizedError') {
      res.status(401).send('Unauthorized');
    } else {
      console.log('is authorized')
      next();  
    }
    
  });

  //Example of a module can apply auth to the endpoint
  // tc auth stuff
  var tcAuth = require('./appirio_node_modules/tc-server-auth')(app);
  //console.log("tcAuth", tcAuth)
  app.use('/_api_/*', tcAuth);

  app.use('/manage/bower_components', express.static(__dirname + '/../client/bower_components'));
  app.use('/edit', express.static(__dirname + '/../client/edit-challenge'));
  app.use('/manage', express.static(__dirname + '/../client/manage-challenge'));
  app.use('/bower_components', express.static(__dirname + '/../client/bower_components'));
  app.use('/*/appirio_bower_components', express.static(__dirname + '/../client/appirio_bower_components'));

  //server side routes
  //challenge management
  app.get('/manage', function (req, res) {
    var fileOptions1 = {
      root: __dirname + '/../client'
    };

    res.sendFile('manage-challenge/index.html', fileOptions1, handleFileError);
  });

  //create/edit challenge
  app.get('/edit', function (req, res) {
    res.sendFile('edit-challenge/index.html', fileOptions, handleFileError);
  });

app.get('/_api_/test', function(req, res, next) {
    console.log('in web.js app.get call2')    
    res.send('hi')
    // passport.authenticate('auth0', function(err, user, info) {
    //   console.log('got an authenticated api request. w00t');
    //   console.log('err...', err)
    //   console.log('info...', info)
    //   console.log('user...', user)
    //   if (err) return next(err);
    //   if (!user) {
    //     return res.redirect('/login');
    //   } else {
    //     console.log('DID IT1!')
    //     req.logIn(user, function(err) {
    //       console.log('logged in user!', err)
    //     //   if (err) { return next(err); }
    //       // return res.redirect('/users/' + user.username);
    //     });
    //     return res.redirect('/#/_auth_?jwt=' + info.id_token + '&state=' + req.query.state);        
    //   }
    // });
    
  });
  

  //default direct to manage page
  app.get('/', function (req, res) {
    res.redirect('/manage');
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