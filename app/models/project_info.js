// app/models/project_info.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
  project_name: {type: String, unique:true},
  start_tstmp: Date,
});

module.exports = mongoose.model('project_info', ProjectSchema, 'ProjectInfo');