// app/models/report_data.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ReportSchema = new Schema({
	iusswid: {type: String, unique:true},
	"Reads/SP": String,
	"Map %": String,
	Reads: Number,
	Yield: Number,
	"% on Target": String,
	"Insert Mean": String,
	"Insert Stdev": String,
	"Read Length": String,
	"Coverage (collapsed)": String,
	"Coverage (raw)": String,
	"% Mouse Content": String
});

module.exports = mongoose.model('report_data', ReportSchema, 'IUSSWIDReportData');