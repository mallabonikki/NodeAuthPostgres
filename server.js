//  /server.js
// Original Setup taken from Scotch.io "Easy node authentication setup and local"
// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 3000;
var pg = require('pg');
var passport = require('passport');
var flash    = require('connect-flash');

var logger     = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var db_config = require('./server/config/database.json'); //connect to pg server on aws

// configuration ===============================================================
var pool = new pg.Pool(db_config);
pool.connect(function(err, client, done){
	if(err){
		return console.error('error fetching client from pool', err);
	}
	done();
}); // connect to our database

require('./server/config/passport.js')(passport); // pass passport for configuration

// set up our express application
app.use(logger('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
	app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs'); // set up ejs for templating
app.set('views', './client/views');
// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./server/routes/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
