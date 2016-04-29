// app/models/donor_info.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DonorSchema = new Schema({
	donor_name: {type: String, unique:true},
	institute: String,
	external_name: String,
	donor_head: String
}, {_id: false});

module.exports = mongoose.model('donor_info', DonorSchema, 'DonorInfo');