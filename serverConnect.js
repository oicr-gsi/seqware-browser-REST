var mongoose = require('mongoose');

var host = process.env.npm_config_host;
var database = process.env.npm_config_database;
var port = process.env.npm_config_web_port;
if (host!==undefined&&database!==undefined) {
	mongoose.connect('mongodb://' + host + '/' + database, function (err) {
		if (err) console.error(err);
	});
	var server = require('./server')(port);
} else {
	console.log("arguments were not entered correctly. The format should be: npm --host=____ --database=d____ --port=____ start");
}