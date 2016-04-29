// app/models/graph_data.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GraphSchema = new Schema({
	iusswid: {type: String, unique:true},
	"Read Breakdown": Object,
	"Insert Distribution": Object,
	"Soft Clip by Cycle": Object,
	"Title": String
});

module.exports = mongoose.model('graph_data', GraphSchema, 'IUSSWIDGraphData');