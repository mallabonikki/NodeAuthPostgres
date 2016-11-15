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

var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var knex 		 = require ('knex');


// configuration ===============================================================
var db_conn_string = require('./server/config/database.json')
//load connection config file
// Example database.config file
// {
//	"user": "my_username", 
//	"database": "my_database_name",
//	"password": "my_password",
//	"host": "localhost",
//	"port": 5432,
//	"max": 10,
//	"idleTimeoutMills": 30000
// }

//---------------------------------------------------
// Connect to our pg database using config .json file
//---------------------------------------------------

//this initializes a connection pool
//it will keep idle connections open for period determined in the config file
//and set a limit of maximum idle clients
var pool = new pg.Pool(db_conn_string);

// to run a query we can acquire a client from the pool
// run a query on the client, and then return the client to the pool
// scripts borrowed from npmjs pg package docs

pool.connect(function(err, client, done){
	if(err){
		return console.error('error fectching client from pool', err);
}
	// Return current time to verify connection success. 
	client.query('SELECT NOW() AS "theTime"', function(err,result){
		done();
		
		if(err){
			return console.error('Error running startup query', err);
		}
		console.log('Connected to ', client.database, ' at ', result.rows[0].theTime,' on port ', client.port);
		client.end();
	});
});

pool.on('error', function (err, client){
	console.error('idle client error', err.message, err.stack);
});

//require('./server/config/passport.js')(passport); // pass passport for configuration

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
