// app/models/file_info.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FileSchema = new Schema({
	fileSWID: String,
	file_path: String,
	WorkflowInfo_accession: String
});

module.exports = mongoose.model('file_info', FileSchema, 'FileInfo');