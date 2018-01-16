// app/models/file_info.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FileSchema = new Schema({
  fileSWID: String,
  file_path: String,
  WorkflowInfo_accession: String
});

module.exports = mongoose.model('file_info', FileSchema, 'FileInfo');