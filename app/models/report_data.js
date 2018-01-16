// app/models/report_data.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReportSchema = new Schema({
  iusswid: {type: String, unique:true},
  'Reads/SP': String,
  'Map %': String,
  Reads: Number,
  Yield: Number,
  '% on Target': String,
  'Insert Mean': String,
  'Insert Stdev': String,
  'Read Length': String,
  'Coverage (collapsed)': String,
  'Coverage (raw)': String,
  '% Mouse Content': String
});

module.exports = mongoose.model('report_data', ReportSchema, 'IUSSWIDReportData');