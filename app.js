var express = require('express');
var passport = require('passport');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var mongoose = require('mongoose');

var app = express();

//Connect to mongoDB
mongoose.connect('mongodb://localhost/facebook');

require('./config/passport')(passport); // pass passport for configuration

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'alexredchets', resave: true, saveUninitialized: true }));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());
require('./app/routes')(app, passport); // load our routes and pass in app and fully configured passport

app.listen(8080);
console.log('Server is running on port 8080');

module.exports = app;
