// app/models/run_info.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RunSchema = new Schema({
	run_name: {type: String, unique:true},
	start_tstmp: Date,
	status: String,
});

module.exports = mongoose.model('run_info', RunSchema, 'RunInfo');