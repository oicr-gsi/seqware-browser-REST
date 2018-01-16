// app/models/run_report_info.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RunReportSchema = new Schema({
  run_name: {type: String, unique:true},
});

module.exports = mongoose.model('run_report_info', RunReportSchema, 'RunReportData');