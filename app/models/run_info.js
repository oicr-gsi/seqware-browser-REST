// app/models/run_info.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RunSchema = new Schema({
  run_name: {type: String, unique:true},
  start_tstmp: Date,
  status: String,
});

module.exports = mongoose.model('run_info', RunSchema, 'RunInfo');