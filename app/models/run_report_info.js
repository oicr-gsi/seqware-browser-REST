// app/models/run_report_info.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RunSchema = new Schema({
	run_name: {type: String, unique:true},
});

module.exports = mongoose.model('run_report_info', RunSchema, 'RunReportDataPhasing');