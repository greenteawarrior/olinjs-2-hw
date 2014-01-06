
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var cats = require('./routes/cats');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');

var app = express();


// all environments
app.set('port', process.env.PORT || 5000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

//mongoose!!
//refer to https://devcenter.heroku.com/articles/nodejs-mongoose

// Here we find an appropriate database to connect to, defaulting to
// localhost if we don't find one.
var uristring = process.env.MONGOLAB_URI || 'mongodb://localhost/HelloMongoose';

// Makes connection asynchronously.  Mongoose will queue up database
// operations and release them when the connection is complete.
mongoose.connect(uristring, function (err, res) {
  if (err) {
  console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
  console.log ('Succeeded connected to: ' + uristring);
  }
});
// //end of mongoose stuff in app.js


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

//cats!
app.get('/cats/new', cats.newCat);
app.get('/cats', cats.catList);
app.get('/cats/color/:color', cats.specificColorList);
app.get('/cats/delete/old', cats.deleteOldCat);
