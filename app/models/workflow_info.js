// app/models/workflow_info.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WorkflowSchema = new Schema({
  sw_accession: {type: String, unique:true},
  workflow_run_id: Number,
  status: String,
  status_cmd: String,
  start_tstmp: Date,
  end_tstmp: Date,
  workflow_name: String,
  analysis_type: String
});

module.exports = mongoose.model('workflow_info', WorkflowSchema, 'WorkflowInfo');