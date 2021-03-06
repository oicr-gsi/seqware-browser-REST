// app/models/current_workflow_runs.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CWFRSchema = new Schema({
	sw_accession: {type: String, unique:true},
	workflow_run_id: Number,
	status: String,
	status_cmd: String,
	start_tstmp: Date,
	end_tstmp: Date,
	workflow_name: String,
	analysis_type: String
});

module.exports = mongoose.model('current_workflow_runs', CWFRSchema, 'CurrentWorkflowRuns');