// app/models/rna_data.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RNASchema = new Schema({
  iusswid: {type: String, unique:true},
  'Bases Breakdown': String,
  'RSeQC Gene Body Coverage': String,
  'Junction Saturation': String,
  'Total Reads': String,
  'Uniq Reads': String,
  'Reads/SP': String,
  'Yield': String,
  'Proportion Correct Strand Reads': String,
  'Median 5Prime to 3Prime Bias': String,
  '% rRNA Content': String
});

module.exports = mongoose.model('rna_data', RNASchema, 'IUSSWIDRNASeqQCData');