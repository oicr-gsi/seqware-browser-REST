var mongoose = require('mongoose');
var host = process.env.npm_config_host;
var database = process.env.npm_config_database;
var port = process.env.npm_config_web_port;
var SwaggerExpress = require('swagger-express-mw');
var SwaggerUi = require('swagger-tools/middleware/swagger-ui');
var swagger_app = require('express')();

process.env.SUPPRESS_NO_CONFIG_WARNING = 'y';

module.exports = swagger_app; // for testing

var swagger_config = {
  appRoot: __dirname // required config
};

SwaggerExpress.create(swagger_config, function(err, swaggerExpress) {
  if (err) { throw err; }
  //swagger ui
  swagger_app.use(SwaggerUi(swaggerExpress.runner.swagger));
  // install middleware
  swaggerExpress.register(swagger_app);
  var port = process.env.PORT || 10010;
  swagger_app.listen(port, "0.0.0.0");
});

if (host!==undefined&&database!==undefined) {
	mongoose.connect('mongodb://' + host + '/' + database, function (err) {
		if (err) console.error(err);
	});
	var server = require('./server')(port);
} else {
	//incase it is swagger, variables not treated the same as with npm
	host=process.env.host;
	database=process.env.database;
	if (host!==undefined&&database!==undefined) {
		mongoose.connect('mongodb://' + host + '/' + database, function (err) {
			if (err) console.error(err);
		});
		var server = require('./server')(port);
	} else {
		console.log("arguments were not entered correctly. The format should be: npm --host=____ --database=d____ --port=____ start");
	}
}