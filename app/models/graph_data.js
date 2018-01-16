// app/models/graph_data.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GraphSchema = new Schema({
  iusswid: {type: String, unique:true},
  'Read Breakdown': Object,
  'Insert Distribution': Object,
  'Soft Clip by Cycle': Object,
  'Title': String
});

module.exports = mongoose.model('graph_data', GraphSchema, 'IUSSWIDGraphData');