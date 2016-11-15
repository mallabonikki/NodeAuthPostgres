var promise = require('bluebird');

var options = {
	//Initializations Options.
	promiseLab:promise
};

var pgp = require('pg-promise')(options);
var connConfig = require('../config/database.json');
var db = pgp(connConfig);

module.exports = {
	getSingleUser: getSingleUser
};

function getSingleUser(req, res, next){
	db.one('select * from public.users')
		.then(function (data){
			res.status(200)
				.json({
					status: 'success',
					data: data,
					message: 'Retrived single user'
				});
		})
		.catch(function (err){
			return next (err);
		});
}


