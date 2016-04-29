// app/models/library_info.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LibrarySchema = new Schema({
	library_seqname: {type: String, unique:true},
	template_id: Number,
	library_name: String,
	ProjectInfo_name: String,
	RunInfo_name: String,
	lane: Number,
	skip: Boolean,
	create_tstmp: Date,
	prep_tstmp: Date,
	library_type: String,
	tissue_type: String,
	DonorInfo_name: String,
	library_head: String,
	tissue_origin: String,
	receive_tstmp: String,
	barcode: String,
	WorkflowInfo_accession: Array,
	iusswid: String
});

module.exports = mongoose.model('library_info', LibrarySchema, 'LibraryInfo');