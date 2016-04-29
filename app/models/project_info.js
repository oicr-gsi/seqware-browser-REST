// app/models/project_info.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProjectSchema = new Schema({
	project_name: {type: String, unique:true},
	start_tstmp: Date,
});

module.exports = mongoose.model('project_info', ProjectSchema, 'ProjectInfo');