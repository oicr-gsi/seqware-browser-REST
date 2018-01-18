'use strict';

require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const current_workflow_runs = require('./app/models/current_workflow_runs');
const donor_info = require('./app/models/donor_info');
const file_info = require('./app/models/file_info');
const graph_data = require('./app/models/graph_data');
const rna_data = require('./app/models/rna_data');
const report_data = require('./app/models/report_data');
const library_info = require('./app/models/library_info');
const project_info = require('./app/models/project_info');
const run_info = require('./app/models/run_info');
const run_report_info = require('./app/models/run_report_info');
const workflow_info = require('./app/models/workflow_info');
// const SwaggerExpress = require('swagger-express-mw');
// const SwaggerUi = require('swagger-tools/middleware/swagger-ui');
// const swagger_app = require('express')();
const utils = require('./app/controllers/controllerUtils');

// Initialize mongo config
mongoose.connect('mongodb://' + process.env.MONGO_HOST + '/' + process.env.MONGO_DB, function (err) {
  if (err) console.error(err);
});

// configure app to use bodyParser() (get data from POST)
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//module.exports = swagger_app; // for testing

const swagger_config = {
  appRoot: __dirname // required config
};
// API Routes
// ========================================================
const router = express.Router();

// Test
router.get('/', function (req, res, next) {
  res.status(200).json({message: 'yay!! welcome to the api!'});
  next();
});

// helper methods
const zeropad = (num) => {
  return ('0' + num).slice(-2);
};
const formatDateForMongo = (dateString) => {
  const date = new Date(dateString);
  if (date == 'Invalid Date') return undefined;
  return date.getFullYear() + 
            '-' + zeropad(date.getMonth() +1) +
            '-' + zeropad(date.getDate()) +
            ' ' + zeropad(date.getHours()) +
            ':' + zeropad(date.getMinutes()) +
            ':' + zeropad(date.getSeconds());
};

//===========================================================

// Routes that end in current_workflow_runs
// all current workflow runs
router.get('/current_workflow_runs', function (req, res, next) {
  current_workflow_runs.find({})
    .then(docs => utils.returnDocs(docs, res, next))
    .catch(err => next(utils.generateError(500, err)));
});


// project_info
// all projects
router.get('/project_info', function (req, res, next) {
  project_info.find({})
    .then(docs => utils.returnDocs(docs, res, next))
    .catch(err => next(utils.generateError(500, err)));
});

// one project
router.get('/project_info/:_id', function (req, res, next) {
  utils.returnIfNoParam('project name', req.params._id, next);
  project_info.find({project_name: req.params._id})
    .then(docs => utils.returnDocs(docs, res, next))
    .catch(err => next(utils.generateError(500, err)));
});

// libraries per project
router.get('/project_info/:_id/libraries', function (req, res, next) {
  utils.returnIfNoParam('project name', req.params._id, next);
  library_info.find({ProjectInfo_name: req.params._id})
    .then(docs => utils.returnDocs(docs, res, next))
    .catch(err => next(utils.generateError(500, err)));
});

// donor_info
// all donors
router.get('/donor_info', function (req, res, next) {
  donor_info.find({})
    .then(docs => utils.returnDocs(docs, res, next))
    .catch(err => next(utils.generateError(500, err)));
});

// one donor
router.get('/donor_info/:_id', function (req, res, next) {
  utils.returnIfNoParam('donor name', req.params._id, next);
  donor_info.find({donor_name: req.params._id})
    .then(docs => utils.returnDocs(docs, res, next))
    .catch(err => next(utils.generateError(500, err)));
});

// libraries per donor
router.get('/donor_info/:_id/libraries', function (req, res, next) {
  utils.returnIfNoParam('donor name', req.params._id, next);
  library_info.find({DonorInfo_name: req.params._id})
    .then(docs => utils.returnDocs(docs, res, next))
    .catch(err => next(utils.generateError(500, err)));
});

// library_info
// all libraries
router.get('/library_info', function (req, res, next) {
  library_info.find({})
    .then(docs => utils.returnDocs(docs, res, next))
    .catch(err => next(utils.generateError(500, err)));
});

// one library
router.get('/library_info/:_id', function (req, res, next) {
  utils.returnIfNoParam('library name', req.params._id, next);
  library_info.find({library_seqname: req.params._id})
    .then(docs => utils.returnDocs(docs, res, next))
    .catch(err => next(utils.generateError(500, err)));
});

// count the number oflibraries in a run
router.get('/run_count/:_id', function (req, res, next) {
  utils.returnIfNoParam('run name', req.params._id, next);
  library_info.aggregate([
    { $match: { RunInfo_name: req.params._id}},
    {$group: {
      _id: null,
      count: {$sum: 1} }}
  ])
    .then(docs => utils.returnDocs(docs, res, next))
    .catch(err => next(utils.generateError(500, err)));
});

// workflows per library
router.get('/library_info/:_id/workflows', function (req, res, next) {
  utils.returnIfNoParam('library name', req.params._id, next);
  library_info.find({library_seqname: req.params._id}, 'WorkflowInfo_accession')
    .then((docs) => {
      if (docs[0] && docs[0].WorkflowInfo_accession) {
        workflow_info.find({sw_accession: {$in: docs[0].WorkflowInfo_accession}})
          .then(workflows => utils.returnDocs(workflows, res, next))
          .catch(err => next(utils.generateError(500, err)));
      } else {
        utils.returnDocs([], res, next);
      }
    });
});

// run_info
// all runs
router.get('/run_info', function (req, res, next) {
  run_info.find({})
    .then(docs => utils.returnDocs(docs, res, next))
    .catch(err => next(utils.generateError(500, err)));
});

// one run
router.get('/run_info/:_id', function (req, res, next) {
  utils.returnIfNoParam('run name', req.params._id, next);
  run_info.find({run_name: req.params._id})
    .then(docs => utils.returnDocs(docs, res, next))
    .catch(err => next(utils.generateError(500, err)));
});

// libraries per run
router.get('/run_info/:_id/libraries', function (req, res, next) {
  utils.returnIfNoParam('run name', req.params._id, next);
  library_info.find({RunInfo_name: req.params._id})
    .then(docs => utils.returnDocs(docs, res, next))
    .catch(err => next(utils.generateError(500, err)));
});

// workflow_info
// one workflow
router.get('/workflow_info/:_id', function (req, res, next) {
  utils.returnIfNoParam('SeqWare accession', req.params._id, next);
  workflow_info.find({sw_accession: req.params._id})
    .then(docs => utils.returnDocs(docs, res, next))
    .catch(err => next(utils.generateError(500, err)));
});

// files per workflow
router.get('/workflow_info/:_id/files', function (req, res, next) {
  utils.returnIfNoParam('SeqWare accession', req.params._id, next);
  file_info.find({WorkflowInfo_accession: req.params._id}, 'fileSWID file_path')
    .then(docs => utils.returnDocs(docs, res, next))
    .catch(err => next(utils.generateError(500, err)));
});

//graphs per iusswid
router.get('/graph_data/:_id', function (req, res, next) {
  utils.returnIfNoParam('IUS SWID', parseInt(req.params._id), next);
  const id = parseInt(req.params._id);
  graph_data.find({iusswid: id})
    .then(docs => utils.returnDocs(docs, res, next))
    .catch(err => next(utils.generateError(500, err)));
});
//========================================================
//run timeframe summaries
router.get('/run_timeframe_summary_running', function (req, res, next) {
  next(utils.generateError(400, 'please provide start date and end date (YYYY-MM-DD)'));
});

router.get('/run_timeframe_summary_running/:start/:end', function (req, res, next) {
  const start_date = formatDateForMongo(req.params.start);
  const end_date = formatDateForMongo(req.params.end);
  utils.returnIfNoParam('start date', start_date, next);
  utils.returnIfNoParam('end date', end_date, next);
  library_info.aggregate([
    {$match: { create_tstmp: {$gt: start_date, $lt: end_date} }},
    {$unwind: {path:'$WorkflowInfo_accession', preserveNullAndEmptyArrays: true}},
    {$lookup: {
      from: 'WorkflowInfo',
      localField: 'WorkflowInfo_accession',
      foreignField: 'sw_accession',
      as: 'workflows' }},
    {$unwind: {path:'$workflows', preserveNullAndEmptyArrays: true}},
    {$project: {
      project_name: '$ProjectInfo_name',
      workflow_name: '$workflows.workflow_name',
      if_running: {$cond: {if:{ $eq:['$workflows.status','running']},
        then: 1,
        else: 0}} }},
    {$group: {
      _id: {
        project_name: '$project_name',
        workflow_name: '$workflow_name'},
      count: {$sum: 1},
      running_count: {$sum: '$if_running'} }},
    {$group: {
      _id: '$_id.workflow_name',
      running_count: {$sum: '$running_count'},
      projects: {$addToSet: {
        project_name: '$_id.project_name',
        count: '$count'}} }}
  ])
    .then(docs => utils.returnDocs(docs, res, next))
    .catch(err => next(utils.generateError(500, err)));
});

router.get('/run_timeframe_summary_libraries', function (req, res, next) {
  next(utils.generateError(400, 'please provide start date and end date (YYYY-MM-DD)'));
});

router.get('/run_timeframe_summary_libraries/:start/:end', function (req, res, next) {
  const start_date = formatDateForMongo(req.params.start);
  const end_date = formatDateForMongo(req.params.end);
  utils.returnIfNoParam('start date', start_date, next);
  utils.returnIfNoParam('end date', end_date, next);
  library_info.aggregate([
    {$match: { create_tstmp: {$gt: start_date, $lt: end_date} }},
    {$unwind: {path:'$WorkflowInfo_accession', preserveNullAndEmptyArrays: true}},
    {$lookup: {
      from: 'WorkflowInfo',
      localField: 'WorkflowInfo_accession',
      foreignField: 'sw_accession',
      as: 'workflows' }},
    {$unwind: {path:'$workflows', preserveNullAndEmptyArrays: true}},
    {$group: {
      _id: {
        status: '$workflows.status',
        workflow_name: '$workflows.workflow_name' },
      libraries: {$addToSet: '$library_name'} }},
    {$group: {
      _id: '$_id.status',
      workflow_count: {$sum: 1},
      library_count: {$sum: {$size: '$libraries'}},
      workflows: {$push: {
        workflow_name: '$_id.workflow_name',
        libraries: '$libraries' }} }}
  ])
    .then(docs => utils.returnDocs(docs, res, next))
    .catch(err => next(utils.generateError(500, err)));
});

router.get('/run_timeframe_summary_pending', function (req, res, next) {
  next(utils.generateError(400, 'please provide start date and end date (YYYY-MM-DD)'));
});

router.get('/run_timeframe_summary_pending/:start/:end', function (req, res, next) {
  const start_date = formatDateForMongo(req.params.start);
  const end_date = formatDateForMongo(req.params.end);
  utils.returnIfNoParam('start date', start_date, next);
  utils.returnIfNoParam('end date', end_date, next);
  library_info.aggregate([ 
    {$match: { create_tstmp: {$gt: start_date, $lt: end_date} }},
    {$lookup: {
      from: 'RunInfo',
      localField: 'RunInfo_name',
      foreignField: 'run_name',
      as: 'runinfo' }},
    {$unwind: {path:'$runinfo', preserveNullAndEmptyArrays: true}},
    {$project: {
      run_status: '$runinfo.status',
      run_info_name: 1 }},
    {$match: { run_status: 'pending' }},
    {$group: {
      _id: '$run_info_name',
      library_count: {$sum: 1} }}
  ])
    .then(docs => utils.returnDocs(docs, res, next))
    .catch(err => next(utils.generateError(500, err)));
});

router.get('/run_timeframe', function (req, res, next) {
  next(utils.generateError(400, 'please provide start date and end date (YYYY-MM-DD)'));
});

//per one run name
// TODO: update documentation for this method. It's definitely not for one run name.
router.get('/run_timeframe/:start/:end', function (req, res, next) {
  const start_date = formatDateForMongo(req.params.start);
  const end_date = formatDateForMongo(req.params.end);
  utils.returnIfNoParam('start date', start_date, next);
  utils.returnIfNoParam('end date', end_date, next);
  library_info.aggregate([
    {$match: { create_tstmp: {$gt: start_date, $lt: end_date} }},
    {$group: {
      _id: '$iusswid',
      origin: {$push: '$$ROOT'} }},
    {$unwind: {path:'$origin', preserveNullAndEmptyArrays: true}},
    {$unwind: {path:'$origin.workflowinfo_accession', preserveNullAndEmptyArrays: true}},
    {$lookup: {
      from: 'WorkflowInfo',
      localField: 'origin.workflowinfo_accession',
      foreignField: 'sw_accession',
      as: 'workflows' }},
    {$unwind: {path:'$workflows', preserveNullAndEmptyArrays: true}},
    {$group: {
      _id: {
        iusswid: '$_id',
        analysis_type: '$workflows.analysis_type',
        status: '$workflows.status' },
      status_count: {$sum: 1},
      origin: {$first: '$origin'} }},
    {$group: {
      _id: '$_id.iusswid',
      workflow_analysis_status: {$push: {
        analysis_type: '$_id.analysis_type',
        status: '$_id.status',
        count: '$status_count'}},
      origin: {$first: '$origin'} }},
    {$group: {
      _id: '$origin.run_info_name',
      unique_projects: {$addToSet: '$origin.project_info_name'},
      projects: {$push: '$origin.project_info_name'},
      libraries: {$push: {
        library_name: '$origin.library_name',
        barcode: '$origin.barcode',
        lane: '$origin.lane',
        workflow_analysis_status: '$workflow_analysis_status' }} }},
    {$unwind: {path:'$unique_projects', preserveNullAndEmptyArrays: true}},
    {$unwind: {path:'$projects', preserveNullAndEmptyArrays: true}},
    {$project: {
      _id: 1,
      unique_projects: 1,
      libraries:1,
      same_projects: {$cond: {if:{ $eq:['$unique_projects','$projects']},
        then: 1,
        else: 0}} }},
    {$group: {
      _id: {run_name: '$_id', unique_projects: '$unique_projects' },
      project_count: {$sum: '$same_projects'},
      libraries: {$first: '$libraries'} }},
    {$group: {
      _id: '$_id.run_name',
      projects: {$push: {
        project_name: '$_id.unique_projects',
        project_count: '$project_count' }},
      libraries: {$first: '$libraries'} }},
    {$lookup: {
      from: 'RunInfo',
      localField: '_id',
      foreignField: 'run_name',
      as: 'runinfo' }},
    {$unwind: {path: '$runinfo', preserveNullAndEmptyArrays: true}},
    {$project: {
      _id:0,
      run_name: '$_id',
      projects: 1,
      sequencing_status: '$runinfo.status',
      start_date: '$runinfo.start_tstmp',
      libraries: 1 }}
  ])
    .then(docs => utils.returnDocs(docs, res, next))
    .catch(err => next(utils.generateError(500, err)));
});

//project runs summary - shares project details
router.get('/project_runs/:_id', function (req, res, next) {
  utils.returnIfNoParam('project name(s)', req.params._id, next);
  const array = req.params._id.split(',');
  library_info.aggregate([
    {$match: { ProjectInfo_name: {$in: array} }},
    {$group: {
      _id: '$RunInfo_name',
      unique_projects: {$addToSet: '$ProjectInfo_name'},
      projects: {$push: {name:'$ProjectInfo_name'}} }},
    {$unwind: {path:'$unique_projects', preserveNullAndEmptyArrays: true}},
    {$unwind: {path:'$projects', preserveNullAndEmptyArrays: true}},
    {$group: {
      _id: {run_name: '$_id', unique_projects: '$unique_projects' },
      project_count: {$sum: 1} }},
    {$group: {
      _id: '$_id.run_name',
      projects: {$push: {
        project_name: '$_id.unique_projects',
        project_count: '$project_count' }} }},
    {$lookup: {
      from: 'RunInfo',
      localField: '_id',
      foreignField: 'run_name',
      as: 'runinfo' }},
    {$unwind: {path: '$runinfo', preserveNullAndEmptyArrays: true}},
    {$project: {
      _id:0,
      run_name: '$_id',
      projects: 1,
      sequencing_status: '$runinfo.status' }}
  ])
    .then(docs => utils.returnDocs(docs, res, next))
    .catch(err => next(utils.generateError(500, err)));
});

//project_summary
router.get('/project_overview_summary', function (req, res, next) {
  next(utils.generateError(400, 'please provide a comma-separated list of project names'));
});

// project activity within past week
router.get('/project_overview_summary/:_id', function (req, res, next) {
  utils.returnIfNoParam('project name(s)', req.params._id, next);
  const array = req.params._id.split(',');
  const startDate = new Date();
  startDate.setDate(startDate.getDate()-7);
  library_info.aggregate([
    { $match: { ProjectInfo_name: {$in: array} }},
    { $unwind: {path: '$WorkflowInfo_accession', preserveNullAndEmptyArrays: true}},
    { $lookup: {
      from: 'WorkflowInfo',
      localField: 'WorkflowInfo_accession',
      foreignField: 'sw_accession',
      as: 'workflows' }},
    { $unwind: {path: '$workflows', preserveNullAndEmptyArrays: true}},
    { $project: {
      ProjectInfo_name: 1,
      status: '$workflows.status',
      library_seqname: 1,
      workflow_name: '$workflows.workflow_name',
      end_tstmp: '$workflows.end_tstmp'}},
    { $match: {status: {$ne: null }}},
    { $match: {$or: [ {end_tstmp: {$gt: startDate }}, {status: 'running'} ]}},
    { $group: {
      _id: {
        project_name: '$ProjectInfo_name',
        status: '$status' },
      libraries: {$addToSet: {name: '$library_seqname'}},
      workflows: {$addToSet: {name: '$workflow_name'}}}},
    { $group: {
      _id: '$_id.status',
      per_project: {$push: {
        project_name: '$_id.project_name',
        library_count: {$size: '$libraries'},
        workflow_count: {$size:'$workflows' } }} }}
  ])
    .then(docs => utils.returnDocs(docs, res, next))
    .catch(err => next(utils.generateError(500, err)));
});

router.get('/project_overview_libraries', function (req, res, next) {
  next(utils.generateError(400, 'please provide a comma-separated list of project names'));
});

router.get('/project_overview_libraries/:_id', function (req, res, next) {
  utils.returnIfNoParam('project name(s)', req.params._id, next);
  const array = req.params._id.split(',');
  library_info.aggregate([
    { $match: { ProjectInfo_name: {$in: array} }},
    {$unwind: {path:'$WorkflowInfo_accession', preserveNullAndEmptyArrays: true}},
    {$lookup: {
      from: 'WorkflowInfo',
      localField: 'WorkflowInfo_accession',
      foreignField: 'sw_accession',
      as: 'workflows' }},
    {$unwind: {path:'$workflows', preserveNullAndEmptyArrays: true}},
    {$group: {
      _id: {
        status: '$workflows.status',
        workflow_name: '$workflows.workflow_name' },
      libraries: {$addToSet: '$library_name'} }},
    {$group: {
      _id: '$_id.status',
      workflow_count: {$sum: 1},
      library_count: {$sum: {$size: '$libraries'}},
      workflows: {$push: {
        workflow_name: '$_id.workflow_name',
        libraries: '$libraries' }} }}
  ])
    .then(docs => utils.returnDocs(docs, res, next))
    .catch(err => next(utils.generateError(500, err)));
});

// TODO: is this even necessary? We never use "Pending" run status anyway
router.get('/project_overview_pending', function (req, res, next) {
  next(utils.generateError(400, 'please provide a comma-separated list of project names'));
});

// TODO: is this even necessary? We never use "Pending" run status anyway
router.get('/project_overview_pending/:_id', function (req, res, next) {
  utils.returnIfNoParam('project name(s)', req.params._id, next);
  const array = req.params._id.split(',');
  library_info.aggregate([
    { $match: { ProjectInfo_name: {$in: array} }},
    {$lookup: {
      from: 'RunInfo',
      localField: 'RunInfo_name',
      foreignField: 'run_name',
      as: 'runinfo' }},
    {$unwind: {path:'$runinfo', preserveNullAndEmptyArrays: true}},
    {$project: {
      run_status: '$runinfo.status',
      run_info_name: 1 }},
    {$match: { run_status: 'pending' }},
    {$group: {
      _id: '$run_info_name',
      library_count: {$sum: 1} }}
  ])
    .then(docs => utils.returnDocs(docs, res, next))
    .catch(err => next(utils.generateError(500, err)));
});

//project_overview
//if not specified, return information on all projects
router.get('/project_overview', function (req, res, next) {
  library_info.aggregate([
    {$group: {
      _id: '$ProjectInfo_name',
      library_count: {$sum: 1},
      unique_donors: {$addToSet: '$library_head'},
      donors: {$push: {name:'$library_head'}} }},
    {$unwind: {path:'$unique_donors', preserveNullAndEmptyArrays: true}},
    {$unwind: {path:'$donors', preserveNullAndEmptyArrays: true}},
    {$group: {
      _id: {project_name: '$_id', unique_donors: '$unique_donors' },
      donor_count: {$sum: 1},
      library_count: {$first: '$library_count' } }},
    {$group: {
      _id: '$_id.project_name',
      library_count: {$first: '$library_count' },
      donors: {$push: {
        donor_name: '$_id.unique_donors',
        donor_count: '$donor_count' }} }},
    {$lookup: {
      from: 'links',
      localField: '_id',
      foreignField: 'project_name',
      as: 'urls' }},
    {$unwind: {path: '$urls', preserveNullAndEmptyArrays: true}},
    {$sort: {_id: 1} },
    {$project: {
      _id: 0,
      project_name: '$_id',
      library_count: 1,
      donors: 1,
      lims_url: '$urls.lims_url',
      jira_url: '$urls.jira_url',
      wiki_url: '$urls.wiki_url' }}
  ])
    .then(docs => utils.returnDocs(docs, res, next))
    .catch(err => next(utils.generateError(500, err)));
});

//return information on an array of specified projects (given as a comma separated string)
router.get('/project_overview/:_id', function (req, res, next) {
  utils.returnIfNoParam('project name(s)', req.params._id, next);
  const array = req.params._id.split(',');
  library_info.aggregate([
    {$match: { ProjectInfo_name: {$in: array} }},
    {$group: {
      _id: '$ProjectInfo_name',
      library_count: {$sum: 1},
      unique_donors: {$addToSet: '$library_head'},
      donors: {$push: {name:'$library_head'}} }},
    {$unwind: {path:'$unique_donors', preserveNullAndEmptyArrays: true}},
    {$unwind: {path:'$donors', preserveNullAndEmptyArrays: true}},
    {$group: {
      _id: {project_name: '$_id', unique_donors: '$unique_donors' },
      donor_count: {$sum: 1},
      library_count: {$first: '$library_count' } }},
    {$group: {
      _id: '$_id.project_name',
      library_count: {$first: '$library_count' },
      donors: {$push: {
        donor_name: '$_id.unique_donors',
        donor_count: '$donor_count' }} }},
    {$lookup: {
      from: 'links',
      localField: '_id',
      foreignField: 'project_name',
      as: 'urls' }},
    {$unwind: {path: '$urls', preserveNullAndEmptyArrays: true}},
    {$sort: {_id: 1} },
    {$project: {
      _id: 0,
      project_name: '$_id',
      library_count: 1,
      donors: 1,
      lims_url: '$urls.lims_url',
      jira_url: '$urls.jira_url',
      wiki_url: '$urls.wiki_url' }}
  ])
    .then(docs => utils.returnDocs(docs, res, next))
    .catch(err => next(utils.generateError(500, err)));
});

//run summary
router.get('/run_workflows_summary', function (req, res, next) {
  next(utils.generateError(400, 'please provide a run name'));
});

//per one run name
router.get('/run_workflows_summary/:_id', function (req, res, next) {
  utils.returnIfNoParam('run name', req.params._id, next);
  library_info.aggregate([
    { $match: {RunInfo_name:req.params._id}},
    { $group: {
      _id: '$RunInfo_name',
      projectSummary: {$addToSet: '$project_info_name'},
      librarySummary: {$addToSet: '$library_type'},
      tissueSummary: {$addToSet: '$tissue_type'},
      origin: {$push: '$$ROOT'} }},
    { $unwind: {path:'$projectSummary', preserveNullAndEmptyArrays: true}},
    { $unwind: {path:'$librarySummary', preserveNullAndEmptyArrays: true}},
    { $unwind: {path:'$tissueSummary', preserveNullAndEmptyArrays: true}},
    { $unwind: {path: '$origin', preserveNullAndEmptyArrays: true}},
    { $project: { 
      _id: 0,
      projectSum: {$cond: {if:{ $eq:['$projectSummary','$origin.project_info_name']},
        then: 1,
        else: 0}},
      librarySum: {$cond: {if:{ $eq:['$librarySummary','$origin.library_type']},
        then: 1,
        else: 0}},
      tissueSum: {$cond: {if:{ $eq:['$tissueSummary','$origin.tissue_type']},
        then: 1,
        else: 0}},
      projectSummary: 1,
      librarySummary: 1,
      tissueSummary:1,
      project_info_name: '$origin.project_info_name',
      skip: '$origin.skip',}},
    { $group: {
      _id: { projectSummary: '$projectSummary', tissueSummary: '$tissueSummary', librarySummary: '$librarySummary'},
      projectTotal: { $sum: '$projectSum' },
      libraryTotal: { $sum: '$librarySum'},
      tissueTotal: { $sum: '$tissueSum' },
      skipped: {$sum: '$skip'},
      project_info_name: {$first: '$project_info_name'},
      libraryCount: {$sum: 1} }},
    { $group: {
      _id:req.params._id,
      skipped: {$first: '$skipped'},
      project_info_name: {$first: '$project_info_name'},
      library_count: {$first: '$libraryCount'},
      project_summary: { $addToSet: {
        projectCode: '$_id.projectSummary', 
        total: '$projectTotal' }},
      library_summary: { $addToSet: {
        libraryType: '$_id.librarySummary', 
        total: '$libraryTotal' }},
      tissue_summary: { $addToSet: {
        tissueType: '$_id.tissueSummary', 
        total: '$tissueTotal' }} }},
    { $lookup: { 
      from: 'RunInfo',            //incorporates run status
      localField: '_id',
      foreignField: 'run_name',
      as: 'runstatus' }},
    { $unwind: {path:'$runstatus', preserveNullAndEmptyArrays: true}},
    { $lookup: {
      from: 'links',
      localField: 'project_info_name',
      foreignField: 'project_name',
      as: 'urls' }},
    { $unwind: {path:'$urls', preserveNullAndEmptyArrays: true}},
    { $project: {
      _id: 0,
      run_name: '$_id',
      status: '$runstatus.status',
      start: '$runstatus.start_tstmp',
      skipped: 1,
      lims: '$urls.lims_url',
      jira: '$urls.jira_url',
      wiki: '$urls.wiki_url',
      library_count: 1,
      project_summary: 1,
      library_summary: 1,
      tissue_summary: 1 }}
  ])
    .then(docs => utils.returnDocs(docs, res, next))
    .catch(err => next(utils.generateError(500, err)));
});

//run workflows
router.get('/run_workflows', function (req, res, next) {
  next(utils.generateError(400, 'please provide a run name'));
});

//per one run name-first 10
router.get('/run_workflows/:_id', function (req, res, next) {
  utils.returnIfNoParam('run name', req.params._id, next);
  library_info.aggregate([
    { $match: {RunInfo_name:req.params._id}},
    { $group: {
      _id: '$RunInfo_name',
      origin: {$push: '$$ROOT'} }},
    { $unwind: {path: '$origin', preserveNullAndEmptyArrays: true}},
    { $unwind: {path: '$origin.WorkflowInfo_accession', preserveNullAndEmptyArrays: true}},
    { $lookup: {
      from: 'WorkflowInfo',
      localField: 'origin.WorkflowInfo_accession',
      foreignField: 'sw_accession',
      as: 'workflows' }},
    { $unwind: {path: '$workflows', preserveNullAndEmptyArrays: true}},
    { $lookup: {
      from: 'FileInfo',
      localField: 'origin.WorkflowInfo_accession',
      foreignField: 'WorkflowInfo_accession',
      as: 'files' }},
    { $unwind: {path: '$files', preserveNullAndEmptyArrays: true}}, 
    { $group: {
      _id: { accession:'$origin.WorkflowInfo_accession', iusswid: '$origin.iusswid'},
      files: {$first: '$files'},
      'fileSum': {$sum: 1},
      workflows: {$first: '$workflows'},
      origin: {$first: '$origin'} }},
    { $group: { 
      _id: '$origin.iusswid',
      library_name: {$first:'$origin.library_name'},
      lane: {$first: '$origin.lane'},
      barcode: {$first: '$origin.barcode'},
      tissue_type: {$first: '$origin.tissue_type'}, 
      workflow_count: {$sum: 1},
      workflows: {$push: { 
        'workflow_info': '$workflows',
        'file_count': {$cond: {if:{ $eq:['$files',null]},
          then: 0,
          else: '$fileSum'}}
      }} }},
    { $sort: {'lane': 1, 'libraries.library_name': 1}}
  ])
    .then(docs => utils.returnDocs(docs, res, next))
    .catch(err => next(utils.generateError(500, err)));
});

//workflows per one run - ten libraries at a time
router.get('/run_workflows/:_id/:libNum', function (req, res, next) {
  utils.returnIfNoParam('run name', req.params._id, next);
  utils.returnIfNoParam('libraries offset', parseInt(req.params.libNum), next);
  req.params.libNum=parseInt(req.params.libNum);
  library_info.aggregate([
    { $match: {RunInfo_name:req.params._id}},
    { $group: {
      _id: '$RunInfo_name',
      origin: {$push: '$$ROOT'} }},
    { $unwind: {path: '$origin', preserveNullAndEmptyArrays: true}},
    { $sort: {'origin.lane': 1, 'origin.library_name': 1}},
    { $skip: req.params.libNum},
    { $limit: 10},
    { $unwind: {path: '$origin.WorkflowInfo_accession', preserveNullAndEmptyArrays: true}},
    { $lookup: {
      from: 'WorkflowInfo',
      localField: 'origin.WorkflowInfo_accession',
      foreignField: 'sw_accession',
      as: 'workflows' }},
    { $unwind: {path: '$workflows', preserveNullAndEmptyArrays: true}},
    { $lookup: {
      from: 'FileInfo',
      localField: 'origin.WorkflowInfo_accession',
      foreignField: 'WorkflowInfo_accession',
      as: 'files' }},
    { $unwind: {path: '$files', preserveNullAndEmptyArrays: true}}, 
    { $group: {
      _id: { accession:'$origin.WorkflowInfo_accession', iusswid: '$origin.iusswid'},
      files: {$first: '$files'},
      'fileSum': {$sum: 1},
      workflows: {$first: '$workflows'},
      origin: {$first: '$origin'} }},
    { $group: { 
      _id: '$origin.iusswid',
      library_name: {$first:'$origin.library_name'},
      lane: {$first: '$origin.lane'},
      barcode: {$first: '$origin.barcode'},
      tissue_type: {$first: '$origin.tissue_type'}, 
      workflow_count: {$sum: 1},
      workflows: {$push: { 
        'workflow_info': '$workflows',
        'file_count': {$cond: {if:{ $eq:['$files',null]},
          then: 0,
          else: '$fileSum'}}
      }} }},
    { $sort: {'lane': 1, 'libraries.library_name': 1}}
  ])
    .then(docs => utils.returnDocs(docs, res, next))
    .catch(err => next(utils.generateError(500, err)));
});

//run summary page
// TODO: add run end timestamp to RunInfo schema and data
router.get('/run_list', function (req, res, next) {
  library_info.aggregate([
    {$group: {
      _id: '$RunInfo_name',
      unique_projects: {$addToSet: '$library_head'},
      projects: {$push: {name:'$library_head'}} }},
    {$unwind: {path:'$unique_projects', preserveNullAndEmptyArrays: true}},
    {$unwind: {path:'$projects', preserveNullAndEmptyArrays: true}},
    {$group: {
      _id: {run_name: '$_id', unique_projects: '$unique_projects' },
      project_count: {$sum: 1} }},
    {$group: {
      _id: '$_id.run_name',
      projects: {$push: {
        project_name: '$_id.unique_projects',
        project_count: '$project_count' }} }},
    {$lookup: {
      from: 'RunInfo',
      localField: '_id',
      foreignField: 'run_name',
      as: 'runinfo' }},
    {$unwind: {path: '$runinfo', preserveNullAndEmptyArrays: true}},
    {$project: {
      _id:0,
      run_name: '$_id',
      projects: 1,
      end_date: '$runinfo.end_tstmp',
      start_date: '$runinfo.start_tstmp' }},
    {$sort: { start_date: -1}},
    {$group: {
      _id: 0,
      list: {$push: '$$ROOT'}
    }}
  ])
    .then(docs => utils.returnDocs(docs, res, next))
    .catch(err => next(utils.generateError(500, err)));
});

//run_details
router.get('/run_details', function (req, res, next) {
  next(utils.generateError(400, 'please provide a run name'));
});

//per one run name
// TODO: add collection QC??
router.get('/run_details/:_id', function (req, res, next) {
  utils.returnIfNoParam('run name', req.params._id, next);
  library_info.aggregate([
    { $match: {RunInfo_name:req.params._id}},
    { $lookup: {
      from: 'QC',
      localField: 'iusswid',
      foreignField: 'iusswid',
      as: 'qc' }},
    { $unwind: {path: '$qc', preserveNullAndEmptyArrays: true}},
    { $group: {
      _id: {                  //combines the reruns of the same iusswid
        iusswid: '$iusswid',
        lane: '$lane',
        library_name:'$library_name'},
      'yield': {$sum: '$qc.yield'},
      'reads': {$sum: '$qc.reads'},
      'read_length_1': {$first: '$qc.read_length_1'},
      'read_length_2': {$first: '$qc.read_length_2'},
      'lane': {$first: '$lane'},
      'barcode':{$first: '$barcode'},
      'project_info': {$first: '$ProjectInfo_name'},
      'run_info_name': {$first: '$RunInfo_name'},
      'project_info_name': {$first: '$ProjectInfo_name'},
      'library_name': {$first: '$library_name'},
      'qc': {$push: '$qc'}}},
    { $project: {
      'has_qc': {$cond: {if:{ $eq:['$yield',0]},//for determining status
        then: 0,
        else: 1}},
      'yield': 1,
      'reads': 1,
      'read_length_1': 1,
      'read_length_2': 1,
      'lane': 1,
      'barcode': 1,
      'project_info': 1,
      'run_info_name': 1,
      'library_name': 1,
      'qc': 1}},
    { $group: {
      _id: '$lane',               //separates according to the lane
      'library_count': {$sum: 1},
      'unique_projects': {$addToSet: '$project_info'},
      'projects': {$push: '$project_info'},
      'yield_sum': {$sum: '$yield'},
      'reads_sum': {$sum: '$reads'},
      'read_length_1': {$first: '$read_length_1'},
      'read_length_2': {$first: '$read_length_2'},
      'sum_has_qc': {$sum: '$has_qc'},
      'run_info_name': {$first: '$run_info_name'},
      'libraries': {$push: {library_name: '$library_name', barcode: '$barcode', qc: '$qc'}} }},
    {$unwind: {path:'$unique_projects', preserveNullAndEmptyArrays: true}},
    {$unwind: {path:'$projects', preserveNullAndEmptyArrays: true}},
    {$project: {                   //project count
      _id: 1,
      library_count: 1,
      unique_projects: 1,
      'yield_sum': 1,
      'reads_sum': 1,
      'read_length_1': 1,
      'read_length_2': 1,
      'sum_has_qc': 1,
      'run_info_name': 1,
      libraries:1,
      same_projects: {$cond: {if:{ $eq:['$unique_projects','$projects']},
        then: 1,
        else: 0}} }},
    {$group: {
      _id: {lane: '$_id', unique_projects: '$unique_projects' },
      project_count: {$sum: '$same_projects'},
      library_count: {$first: '$library_count'},
      'yield_sum': {$first: '$yield_sum'},
      'reads_sum': {$first: '$reads_sum'},
      'read_length_1': {$first: '$read_length_1'},
      'read_length_2': {$first: '$read_length_2'},
      'sum_has_qc': {$first: '$sum_has_qc'},
      'run_info_name': {$first: '$run_info_name'},
      libraries: {$first: '$libraries'} }},
    {$group: {
      _id: '$_id.lane',
      projects: {$push: {
        project_name: '$_id.unique_projects',
        project_count: '$project_count' }},
      library_count: {$first: '$library_count'},
      'yield_sum': {$first: '$yield_sum'},
      'reads_sum': {$first: '$reads_sum'},
      'read_length_1': {$first: '$read_length_1'},
      'read_length_2': {$first: '$read_length_2'},
      'sum_has_qc': {$first: '$sum_has_qc'},
      'run_info_name': {$first: '$run_info_name'},
      libraries: {$first: '$libraries'} }},
    { $lookup: {
      from: 'RunReportData',
      localField: 'run_info_name',
      foreignField: 'run_name',
      as: 'laneinfo' }},
    { $unwind: {path: '$laneinfo', preserveNullAndEmptyArrays: true}},
    { $unwind: {path: '$laneinfo.lanes', preserveNullAndEmptyArrays: true}},
    { $project: {
      'correct_lane': {$cond: {if:{ $or: [{$eq:['$_id', '$laneinfo.lanes.lane']},{ $lt:['$laneinfo.lanes.lane', 0]} ]},
        then: 1,
        else: 0}},          //checks if RunReportData matched the lane, and if the collection has a matching run name
      'library_count': 1,
      'projects': 1,
      'yield_sum': 1,
      'reads_sum': 1,
      'read_length_1': 1,
      'read_length_2': 1,
      'sum_has_qc': 1,
      'laneinfo': 1,
      'libraries':1}},
    { $match: {correct_lane: 1}},
    { $sort: {_id: 1}},
    { $group: {
      _id: req.params._id,
      'lanes': {$push:{
        projects: '$projects',
        lane: '$_id',
        library_count: '$library_count',
        yield_sum: '$yield_sum',
        reads_sum: '$reads_sum',
        'r1_phasing' : '$laneinfo.lanes.r1_phasing',
        'pf_pct_sequencing' : '$laneinfo.lanes.pf_pct_sequencing',
        'r2_prephasing' : '$laneinfo.lanes.r2_prephasing',
        'r2_phasing' : '$laneinfo.lanes.r2_phasing',
        'r1_prephasing' : '$laneinfo.lanes.r1_prephasing',
        'illumina_yield' : {$add: ['$laneinfo.lanes.r1_yield', '$laneinfo.lanes.r2_yield']},
        'illumina_reads' : {$add: ['$laneinfo.lanes.r1_reads', '$laneinfo.lanes.r2_reads']},
        'lane_qc_status': {$cond: {if:{ $lt:['$sum_has_qc','$library_count']},
          then: 'in progress',
          else: 'complete'}},
        'lane_complete_qc': {$cond: {if:{ $lt:['$sum_has_qc','$library_count']},
          then: 0,
          else: 1}},
        libraries: '$libraries'}},
      'lane_sum': {$sum: 1},
      'total_yield_sum': {$sum: '$yield_sum'},
      'total_reads_sum': {$sum: '$reads_sum'},
      'read_length_1': {$first: '$read_length_1'},
      'read_length_2': {$first: '$read_length_2'},
    }},
    { $lookup: {
      from: 'RunInfo',            //incorporates run status
      localField: '_id',
      foreignField: 'run_name',
      as: 'runstatus' }},
    { $unwind: {path:'$runstatus', preserveNullAndEmptyArrays: true}},
    { $project: {
      '_id': 1,
      'run_status': '$runstatus.status',
      'total_libraries': {$sum: '$lanes.library_count'},
      'illumina_yield_sum': {$sum: '$lanes.illumina_yield'},
      'illumina_reads_sum': {$sum: '$lanes.illumina_reads'},
      'total_yield_sum': 1,
      'total_reads_sum': 1,
      'read_length_1': 1,
      'read_length_2': 1,
      'run_qc_status':  {$cond: {if:{ $eq:[{$sum: '$lanes.lane_complete_qc'},'$lane_sum']},
        then: 'completed',
        else: 'in progress'}},
      'lanes': 1}}
  ])
    .then(docs => utils.returnDocs(docs, res, next))
    .catch(err => next(utils.generateError(500, err)));
});

// libraries per run
router.get('/run_report_info/:_id/', function (req, res, next) {
  utils.returnIfNoParam('run name', req.params._id, next);
  run_report_info.aggregate([
    { $match: {run_name:req.params._id}},
    { $group: {
      _id: 0,
      'illumina_yield_sum': {$sum: '$lanes.illumina_yield'},
      'illumina_reads_sum': {$sum: '$lanes.illumina_reads'} }}
  ])
    .then(docs => utils.returnDocs(docs, res, next))
    .catch(err => next(utils.generateError(500, err)));
});

//mongo cannot return this query when the run has over 300 libraries
router.get('/run_details_split', function (req, res, next) {
  next(utils.generateError(400, 'please provide run name, first lane number, and second lane number'));
});

//per one run name
// TODO: fix weird numbers and nulls here
router.get('/run_details_split/:_id/:one/:two', function (req, res, next) {
  const first=parseInt(req.params.one);
  const second=parseInt(req.params.two);
  utils.returnIfNoParam('run name', req.params._id, next);
  utils.returnIfNoParam('first requested lane', first, next);
  utils.returnIfNoParam('second requested lane', second, next);
  library_info.aggregate([
    { $match: {RunInfo_name:req.params._id}},
    { $match: {lane: {$in: [first, second]}}},
    { $lookup: {
      from: 'QC',
      localField: 'iusswid',
      foreignField: 'iusswid',
      as: 'qc' }},
    { $unwind: {path: '$qc', preserveNullAndEmptyArrays: true}},
    { $group: {
      _id: {                  //combines the reruns of the same iusswid
        iusswid: '$iusswid',
        lane: '$lane',
        library_name:'$origin.library_name'},
      'yield': {$sum: '$qc.yield'},
      'reads': {$sum: '$qc.reads'},
      'read_length_1': {$first: '$qc.read_length_1'},
      'read_length_2': {$first: '$qc.read_length_2'},
      'lane': {$first: '$lane'},
      'barcode':{$first: '$barcode'},
      'project_info': {$first: '$ProjectInfo_name'},
      'run_info_name': {$first: '$RunInfo_name'},
      'library_name': {$first: '$library_name'},
      'qc': {$push: '$qc'}}},
    { $project: {
      'has_qc': {$cond: {if:{ $eq:['$yield',0]},//for determining status
        then: 0,
        else: 1}},
      'yield': 1,
      'reads': 1,
      'read_length_1': 1,
      'read_length_2': 1,
      'lane': 1,
      'barcode': 1,
      'project_info': 1,
      'run_info_name': 1,
      'library_name': 1,
      'qc': 1}},
    { $group: {
      _id: '$lane',               //separates according to the lane
      'library_count': {$sum: 1},
      'unique_projects': {$addToSet: '$project_info'},
      'projects': {$push: '$project_info'},
      'yield_sum': {$sum: '$yield'},
      'reads_sum': {$sum: '$reads'},
      'read_length_1': {$first: '$read_length_1'},
      'read_length_2': {$first: '$read_length_2'},
      'sum_has_qc': {$sum: '$has_qc'},
      'run_info_name': {$first: '$run_info_name'},
      'libraries': {$push: {library_name: '$library_name', barcode: '$barcode', qc: '$qc'}} }},
    {$unwind: {path:'$unique_projects', preserveNullAndEmptyArrays: true}},
    {$unwind: {path:'$projects', preserveNullAndEmptyArrays: true}},
    {$project: {                   //project count
      _id: 1,
      library_count: 1,
      unique_projects: 1,
      'yield_sum': 1,
      'reads_sum': 1,
      'read_length_1': 1,
      'read_length_2': 1,
      'sum_has_qc': 1,
      'run_info_name': 1,
      libraries:1,
      same_projects: {$cond: {if:{ $eq:['$unique_projects','$projects']},
        then: 1,
        else: 0}} }},
    {$group: {
      _id: {lane: '$_id', unique_projects: '$unique_projects' },
      project_count: {$sum: '$same_projects'},
      library_count: {$first: '$library_count'},
      'yield_sum': {$first: '$yield_sum'},
      'reads_sum': {$first: '$reads_sum'},
      'read_length_1': {$first: '$read_length_1'},
      'read_length_2': {$first: '$read_length_2'},
      'sum_has_qc': {$first: '$sum_has_qc'},
      'run_info_name': {$first: '$run_info_name'},
      libraries: {$first: '$libraries'} }},
    {$group: {
      _id: '$_id.lane',
      projects: {$push: {
        project_name: '$_id.unique_projects',
        project_count: '$project_count' }},
      library_count: {$first: '$library_count'},
      'yield_sum': {$first: '$yield_sum'},
      'reads_sum': {$first: '$reads_sum'},
      'read_length_1': {$first: '$read_length_1'},
      'read_length_2': {$first: '$read_length_2'},
      'sum_has_qc': {$first: '$sum_has_qc'},
      'run_info_name': {$first: '$run_info_name'},
      libraries: {$first: '$libraries'} }},
    { $lookup: {
      from: 'RunReportData',
      localField: 'origin.RunInfo_name',
      foreignField: 'run_name',
      as: 'laneinfo' }},
    { $unwind: {path: '$laneinfo', preserveNullAndEmptyArrays: true}},
    { $unwind: {path: '$laneinfo.lanes', preserveNullAndEmptyArrays: true}},
    { $project: {
      'correct_lane': {$cond: {if:{ $or: [{$eq:['$_id', '$laneinfo.lanes.lane']},{ $lt:['$laneinfo.lanes.lane', 0]} ]},
        then: 1,
        else: 0}},          //checks if RunReportData matched the lane, and if the collection has a matching run name
      'library_count': 1,
      'projects': 1,
      'yield_sum': 1,
      'reads_sum': 1,
      'read_length_1': 1,
      'read_length_2': 1,
      'sum_has_qc': 1,
      'laneinfo': 1,
      'libraries':1}},
    { $match: {correct_lane: 1}},
    { $sort: {_id: 1}},
    { $group: {
      _id: req.params._id,
      'lanes': {$push:{
        projects: '$projects',
        lane: '$_id',
        library_count: '$library_count',
        yield_sum: '$yield_sum',
        reads_sum: '$reads_sum',
        'r1_phasing' : '$laneinfo.lanes.r1_phasing',
        'pf_pct_sequencing' : '$laneinfo.lanes.pf_pct_sequencing',
        'r2_prephasing' : '$laneinfo.lanes.r2_prephasing',
        'r2_phasing' : '$laneinfo.lanes.r2_phasing',
        'r1_prephasing' : '$laneinfo.lanes.r1_prephasing',
        'illumina_yield' : {$add: ['$laneinfo.lanes.r1_yield', '$laneinfo.lanes.r2_yield']},
        'illumina_reads' : {$add: ['$laneinfo.lanes.r1_reads', '$laneinfo.lanes.r2_reads']},
        'lane_qc_status': {$cond: {if:{ $lt:['$sum_has_qc','$library_count']},
          then: 'in progress',
          else: 'complete'}},
        'lane_complete_qc': {$cond: {if:{ $lt:['$sum_has_qc','$library_count']},
          then: 0,
          else: 1}},
        libraries: '$libraries'}},
      'lane_sum': {$sum: 1},
      'total_yield_sum': {$sum: '$yield_sum'},
      'total_reads_sum': {$sum: '$reads_sum'},
      'read_length_1': {$first: '$read_length_1'},
      'read_length_2': {$first: '$read_length_2'},
    }}
  ])
    .then(docs => utils.returnDocs(docs, res, next))
    .catch(err => next(utils.generateError(500, err)));
});

//details for all projects
router.get('/all_projects', function (req, res, next) {
  library_info.aggregate([
    {$group: {
      _id: '$project_info_name',
      library_count: {$sum: 1},
      unique_donors: {$addToSet: '$library_head'},
      donors: {$push: {name:'$library_head'}} }},
    {$unwind: {path:'$unique_donors', preserveNullAndEmptyArrays: true}},
    {$unwind: {path:'$donors', preserveNullAndEmptyArrays: true}},
    {$group: {
      _id: {project_name: '$_id', unique_donors: '$unique_donors' },
      donor_count: {$sum: 1},
      library_count: {$first: '$library_count' } }},
    {$group: {
      _id: '$_id.project_name',
      library_count: {$first: '$library_count' },
      donors: {$push: {
        donor_name: '$_id.unique_donors',
        donor_count: '$donor_count' }} }},
    {$lookup: {
      from: 'links',
      localField: '_id',
      foreignField: 'project_name',
      as: 'urls' }},
    {$unwind: {path: '$urls', preserveNullAndEmptyArrays: true}},
    {$lookup: {
      from: 'ProjectInfo',
      localField: '_id',
      foreignField: 'project_name',
      as: 'projectinfo' }},
    {$unwind: {path: '$projectinfo', preserveNullAndEmptyArrays: true}},
    {$sort: {_id: 1} },
    {$project: {
      _id: 0,
      project_name: '$_id',
      start_date: '$projectinfo.start_tstmp',
      library_count: 1,
      donors: 1,
      lims_url: '$urls.lims_url',
      jira_url: '$urls.jira_url',
      wiki_url: '$urls.wiki_url' }}
  ])
    .then(docs => utils.returnDocs(docs, res, next))
    .catch(err => next(utils.generateError(500, err)));
});

//project status
router.get('/project_status', function (req, res, next) {
  next(utils.generateError(400, 'please provide project name'));
});

//per one project name
// TODO: should libraries.library_name really be the identity internal name?
router.get('/project_status/:_id', function (req, res, next) {
  utils.returnIfNoParam('project name', req.params._id, next);
  library_info.aggregate([
    {$match: {ProjectInfo_name: req.params._id }},
    {$group: {
      _id: '$iusswid',
      origin: {$push: '$$ROOT'} }},
    {$unwind: {path:'$origin', preserveNullAndEmptyArrays: true}},
    {$unwind: {path:'$origin.WorkflowInfo_accession', preserveNullAndEmptyArrays: true}},
    {$lookup: {
      from: 'WorkflowInfo',
      localField: 'origin.WorkflowInfo_accession',
      foreignField: 'sw_accession',
      as: 'workflows' }},
    {$unwind: {path:'$workflows', preserveNullAndEmptyArrays: true}},
    {$group: {
      _id: {
        iusswid: '$_id',
        analysis_type: '$workflows.analysis_type',
        status: '$workflows.status' },
      status_count: {$sum: 1},
      origin: {$first: '$origin'} }},
    {$group: {
      _id: '$_id.iusswid',
      workflow_analysis_status: {$push: {
        analysis_type: '$_id.analysis_type',
        status: '$_id.status',
        count: '$status_count'}},
      origin: {$first: '$origin'} }},
    {$group: {
      _id: '$origin.DonorInfo_name',
      unique_tissues: {$addToSet: '$origin.tissue_type'},
      tissues: {$push: '$origin.tissue_type'},
      libraries: {$push: {
        library_name: '$origin.DonorInfo_name',
        library_type: '$origin.library_type',
        tissue_type: '$origin.tissue_type',
        tissue_origin: '$tissue_origin',
        workflow_analysis_status: '$workflow_analysis_status' }} }},
    {$unwind: {path:'$unique_tissues', preserveNullAndEmptyArrays: true}},
    {$unwind: {path:'$tissues', preserveNullAndEmptyArrays: true}},
    {$project: {
      _id: 1,
      unique_tissues: 1,
      libraries:1,
      same_tissue: {$cond: {if:{ $eq:['$unique_tissues','$tissues']},
        then: 1,
        else: 0}} }},
    {$group: {
      _id: {donor_name: '$_id', unique_tissues: '$unique_tissues' },
      tissue_count: {$sum: '$same_tissue'},
      libraries: {$first: '$libraries'} }},
    {$group: {
      _id: '$_id.donor_name',
      tissue_types: {$push: {
        tissue_name: '$_id.unique_tissues',
        tissue_count: '$tissue_count' }},
      libraries: {$first: '$libraries'} }},
    {$lookup: {
      from: 'DonorInfo',
      localField: '_id',
      foreignField: 'donor_name',
      as: 'donorinfo' }},
    {$unwind: {path: '$donorinfo', preserveNullAndEmptyArrays: true}},
    {$project: {
      _id:0,
      donor_name: '$_id',
      tissue_types: 1,
      external_id: '$donorinfo.external_name',
      institute: '$donorinfo.institute',
      libraries: 1 }}
  ])
    .then(docs => utils.returnDocs(docs, res, next))
    .catch(err => next(utils.generateError(500, err)));
});

router.get('/project_status_summary', function (req, res, next) {
  next(utils.generateError(400, 'please provide project name'));
});

//per one project name
router.get('/project_status_summary/:_id', function (req, res, next) {
  utils.returnIfNoParam('project name', req.params._id, next);
  library_info.aggregate([
    {$match: {ProjectInfo_name: req.params._id }},
    {$group: {
      _id: '$library_head',
      project_name: {$first: '$ProjectInfo_name'},
      donor_count: {$sum: 1} }},
    {$group: {
      _id: '$project_name',
      libraries: {$sum: '$donor_count'},
      donors: {$push: {
        donor_name: '$_id',
        donor_count: '$donor_count'}} }},
    {$lookup: {
      from: 'links',
      localField: '_id',
      foreignField: 'project_name',
      as: 'urls' }},
    {$unwind: {path: '$urls', preserveNullAndEmptyArrays: true}},
    {$lookup: {
      from: 'ProjectInfo',
      localField: '_id',
      foreignField: 'project_name',
      as: 'projectinfo' }},
    {$unwind: {path: '$projectinfo', preserveNullAndEmptyArrays: true}},
    {$project: {
      _id:0,
      project_name: '$_id',
      libraries: 1,
      donors: 1,
      start_date: '$projectinfo.start_tstmp',
      lims_url: '$urls.lims_url',
      jira_url: '$urls.jira_url',
      wiki_url: '$urls.wiki_url',}}
  ])
    .then(docs => utils.returnDocs(docs, res, next))
    .catch(err => next(utils.generateError(500, err)));
});

//donor_workflows
//if donor name not given
router.get('/donor_workflows', function (req, res, next) {
  next(utils.generateError(400, 'please provide donor name'));
});

//per one donor name
router.get('/donor_workflows/:_id', function (req, res, next) {
  utils.returnIfNoParam('donor name', req.params._id, next);
  library_info.aggregate([
    { $match: {DonorInfo_name:req.params._id}},
    { $group: {
      _id: req.params._id,
      origin: {$push: '$$ROOT'} }},
    { $unwind: {path: '$origin', preserveNullAndEmptyArrays: true}},
    { $unwind: {path: '$origin.WorkflowInfo_accession', preserveNullAndEmptyArrays: true}},
    { $lookup: {
      from: 'WorkflowInfo',
      localField: 'origin.WorkflowInfo_accession',
      foreignField: 'sw_accession',
      as: 'workflows' }},
    { $unwind: {path: '$workflows', preserveNullAndEmptyArrays: true}},
    { $lookup: {
      from: 'FileInfo',
      localField: 'origin.WorkflowInfo_accession',
      foreignField: 'WorkflowInfo_accession',
      as: 'files' }},
    { $unwind: {path: '$files', preserveNullAndEmptyArrays: true}}, 
    { $group: {
      _id: { accession:'$origin.WorkflowInfo_accession', iusswid: '$origin.iusswid'},
      files: {$first: '$files'},
      'fileSum': {$sum: 1},
      workflows: {$first: '$workflows'},
      origin: {$first: '$origin'} }},
    { $group: { 
      _id: '$origin.iusswid',
      library_name: {$first:'$origin.library_name'},
      lane: {$first: '$origin.lane'},
      barcode: {$first: '$origin.barcode'},
      run_name: {$first: '$origin.RunInfo_name'}, 
      workflow_count: {$sum: 1},
      workflows: {$push: { 
        'workflow_name': '$workflows.workflow_name',
        'analysis_type': '$workflows.analysis_type',
        'start_date': '$workflows.start_tstmp',
        'end_date': '$workflows.end_tstmp',
        'file_count': {$cond: {if:{ $eq:['$files',null]},
          then: 0,
          else: '$fileSum'}}
      }} }},
    { $sort: {'lane': 1, 'libraries.library_name': 1}}
  ])
    .then(docs => utils.returnDocs(docs, res, next))
    .catch(err => next(utils.generateError(500, err)));
});

//donor_workflows summary
//if donor name not given
router.get('/donor_workflows_summary', function (req, res, next) {
  next(utils.generateError(400, 'please provide donor name'));
});

//per one donor name
router.get('/donor_workflows_summary/:_id', function (req, res, next) {
  utils.returnIfNoParam('donor name', req.params._id, next);
  library_info.aggregate([
    { $match: {DonorInfo_name:req.params._id}},
    { $group: {
      _id: req.params._id,
      librarySummary: {$addToSet: '$library_type'},
      tissueSummary: {$addToSet: '$tissue_type'},
      origin: {$push: '$$ROOT'} }},
    { $unwind: {path:'$librarySummary', preserveNullAndEmptyArrays: true}},
    { $unwind: {path:'$tissueSummary', preserveNullAndEmptyArrays: true}},
    { $unwind: {path: '$origin', preserveNullAndEmptyArrays: true}},
    { $project: {
      _id: 0,
      librarySum: {$cond: {if:{ $eq:['$librarySummary','$origin.library_type']},
        then: 1,
        else: 0}},
      tissueSum: {$cond: {if:{ $eq:['$tissueSummary','$origin.tissue_type']},
        then: 1,
        else: 0}},
      run_name: '$origin.RunInfo_name',
      librarySummary: 1,
      skip: '$origin.skip',
      project_info_name: '$origin.ProjectInfo_name',
      tissueSummary:1}},
    { $group: {
      _id: {
        tissueSummary: '$tissueSummary',
        librarySummary: '$librarySummary'},
      libraryTotal: { $sum: '$librarySum'},
      tissueTotal: { $sum: '$tissueSum' },
      run_name: {$first: '$run_name'},
      project_info_name: {$first: '$project_info_name'},
      skipped: {$sum: '$skip'},
      libraryCount: {$sum: 1} }},
    { $group: {
      _id:req.params._id,
      skipped: {$first: '$skipped'},
      project_info_name: {$first: '$project_info_name'},
      library_count: {$first: '$libraryCount'},
      run_name: {$first: '$run_name'},
      library_summary: { $addToSet: {
        libraryType: '$_id.librarySummary',
        total: '$libraryTotal' }},
      tissue_summary: { $addToSet: {
        tissueType: '$_id.tissueSummary',
        total: '$tissueTotal' }} }},
    { $lookup: {
      from: 'RunInfo',
      localField: 'run_name',
      foreignField: 'run_name',
      as: 'runstatus' }},
    { $unwind: {path:'$runstatus', preserveNullAndEmptyArrays: true}},
    { $lookup: {
      from: 'DonorInfo',
      localField: '_id',
      foreignField: 'donor_name',
      as: 'donorDetails' }},
    { $unwind: {path:'$donorDetails', preserveNullAndEmptyArrays: true}},
    { $lookup: {
      from: 'links',
      localField: 'project_info_name',
      foreignField: 'project_name',
      as: 'urls' }},
    { $unwind: {path:'$urls', preserveNullAndEmptyArrays: true}},
    { $project: {
      _id: 0,
      donor_name: '$_id',
      institute: '$donorDetails.institute',
      status: '$runstatus.status',
      start: { $min: '$runstatus.start_tstmp'},
      end: { $max: '$runstatus.end_tstmp'},
      lims: '$urls.lims_url',
      jira: '$urls.jira_url',
      wiki: '$urls.wiki_url',
      skipped: 1,
      library_count: 1,
      library_summary: 1,
      tissue_summary: 1 }}
  ])
    .then(docs => utils.returnDocs(docs, res, next))
    .catch(err => next(utils.generateError(500, err)));
});

//donor_details
//if donor name not given
router.get('/donor_details', function (req, res, next) {
  next(utils.generateError(400, 'please provide donor name'));
});

//per one run name
router.get('/donor_details/:_id', function (req, res, next) {
  utils.returnIfNoParam('donor name', req.params._id, next);
  library_info.aggregate([
    { $match: {DonorInfo_name:req.params._id}},
    { $lookup: {
      from: 'QC',
      localField: 'iusswid',
      foreignField: 'iusswid',
      as: 'details' }},
    { $unwind: {path: '$details', preserveNullAndEmptyArrays: true}},
    { $group: {
      _id: '$details.type',
      donor_info_name: {$first: '$DonorInfo_name'},
      project_info_name: {$first: '$ProjectInfo_name'},
      qc_table: {$push: {
        library_name: '$library_name',
        iusswid: '$iusswid',
        barcode: '$barcode',
        qc: '$details' }} }},
    { $lookup: {
      from: 'DonorInfo',
      localField: 'donor_info_name',
      foreignField: 'donor_name',
      as: 'external' }},
    { $unwind: {path: '$external', preserveNullAndEmptyArrays: true}},
    { $lookup: {
      from: 'links',
      localField: 'project_info_name',
      foreignField: 'project_name',
      as: 'urls' }},
    { $unwind: {path:'$urls', preserveNullAndEmptyArrays: true}},
    { $group: {
      _id: '$donor_info_name',
      lims: {$first: '$urls.lims_url'},
      jira: {$first: '$urls.jira_url'},
      wiki: {$first: '$urls.wiki_url'},
      external_id: {$first: '$external.external_name'},
      tables: {$push: {
        library_type: '$_id',
        qc_table: '$qc_table' }} }}
  ])
    .then(docs => utils.returnDocs(docs, res, next))
    .catch(err => next(utils.generateError(500, err)));
});
// ========================================================
// Register routes
app.use('/api', router);

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.status || 500);
  res.json({ 'errors': err.error });
  res.end();
  next();
};
app.use(errorHandler);

// SwaggerExpress.create(swagger_config, function (err, swaggerExpress) {
//   if (err) { throw err; }
//   //swagger ui
//   swagger_app.use(SwaggerUi(swaggerExpress.runner.swagger));
//   // install middleware
//   swaggerExpress.register(swagger_app);

//   const port = process.env.PORT || 10010;
//   swagger_app.listen(port, '0.0.0.0');
// });

// Start the server
module.exports = app;

// set the port
const port = process.env.PORT || 8060;
app.set('port', port);
const server = app.listen(app.get('port'), () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log('Listening at http://%s:%s', host, port);
});