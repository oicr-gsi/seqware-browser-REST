// server.js

// Set up
// Call required packages
var config = require('config.js')
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var current_workflow_runs = require('./app/models/current_workflow_runs');
var donor_info = require('./app/models/donor_info');
var file_info = require('./app/models/file_info');
var graph_data = require('./app/models/graph_data');
var rna_data = require('./app/models/rna_data');
var report_data = require('./app/models/report_data');
var library_info = require('./app/models/library_info');
var project_info = require('./app/models/project_info');
var run_info = require('./app/models/run_info');
var run_report_info = require('./app/models/run_report_info');
var workflow_info = require('./app/models/workflow_info');

// Initialize mongo config
mongoose.connect('mongodb://' + config.mongo.host + '/' + config.mongo.database, function (err) {
	if (err) console.error(err);
});

// configure app to use bodyParser() (get data from POST)
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// set the port
var port = process.env.PORT || 8080;

// API Routes
// ========================================================
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
	console.log('Something is happening'); //log
	next(); // make sure we go to the next routes
});

// Test
router.get('/', function(req, res) {
	res.json({message: 'yay!! welcome to the api!'});
});

//===========================================================

// Routes that end in current_workflow_runs
// all current workflow runs
router.get('/current_workflow_runs', function(req, res) {
	current_workflow_runs.find({}, function(err, docs) {
		if (err) throw err;
		res.json(docs);
	});
});


// project_info
// all projects
router.get('/project_info', function(req, res) {
	project_info.find({}, function(err, docs) {
		if (err) throw err;
		res.json(docs);
	});
});

// one project
router.get('/project_info/:_id', function(req, res) {
	if (req.params._id) {
		project_info.find({project_name: req.params._id}, function(err, docs) {
			if (err) throw err;
			if (typeof docs[0] !== 'undefined') {
				res.json(docs);
			} else {
				res.json({message: 'Not found'});
			}
		});
	}
});

// libraries per project
router.get('/project_info/:_id/libraries', function(req, res) {
	if (req.params._id) {
		library_info.find({ProjectInfo_name: req.params._id}, function(err, docs) {
			if (err) throw err;
			if (typeof docs[0] !== 'undefined') {
				res.json(docs);
			} else {
				res.json({message: 'Not found'});
			}
		});
	}
});

// donor_info
// all donors
router.get('/donor_info', function(req, res) {
	donor_info.find({}, function(err, docs) {
		if (err) throw err;
		res.json(docs);
	});
});

// one donor
router.get('/donor_info/:_id', function(req, res) {
	if (req.params._id) {
		donor_info.find({donor_name: req.params._id}, function(err, docs) {
			if (err) throw err;
			if (typeof docs[0] !== 'undefined') {
				res.json(docs);
			} else {
				res.json({message: 'Not found'});
			}
		});
	}
});

// libraries per donor
router.get('/donor_info/:_id/libraries', function(req, res) {
	if (req.params._id) {
		library_info.find({DonorInfo_name: req.params._id}, function(err, docs) {
			if (err) throw err;
			if (typeof docs[0] !== 'undefined') {
				res.json(docs);
			} else {
				res.json({message: 'Not found'});
			}
		});
	}
});

// library_info
// all libraries
router.get('/library_info', function(req, res) {
	library_info.find({}, function(err, docs) {
		if (err) throw err;
		res.json(docs);
	});
});

// one library
router.get('/library_info/:_id', function(req, res) {
	if (req.params._id) {
		library_info.find({library_seqname: req.params._id}, function(err, docs) {
			if (err) throw err;
			if (typeof docs[0] !== 'undefined') {
				res.json(docs);
			} else {
				res.json({message: 'Not found'});
			}
		});
	}
});

// workflows per library
router.get('/library_info/:_id/workflows', function(req, res) {
	if (req.params._id) {
		library_info.find({library_seqname: req.params._id}, 'WorkflowInfo_id', function(err, docs) {
			if (err) throw err;
			if (typeof docs[0] !== 'undefined') {
				if (typeof docs[0].WorkflowInfo_id !== 'undefined') {
					workflow_info.find({_id: {$in: docs[0].WorkflowInfo_id}}, function(err, workflows) {
						res.json(workflows);
					});
				} else {
					res.json({message: 'Workflows Not found'});
				}
			} else {
				res.json({message: 'Not found'});
			}
		});
	}
});

// run_info
// all runs
router.get('/run_info', function(req, res) {
	run_info.find({}, function(err, docs) {
		if (err) throw err;
		res.json(docs);
	});
});

// one run
router.get('/run_info/:_id', function(req, res) {
	if (req.params._id) {
		run_info.find({run_name: req.params._id}, function(err, docs) {
			if (err) throw err;
			if (typeof docs[0] !== 'undefined') {
				res.json(docs);
			} else {
				res.json({message: 'Not found'});
			}
		});
	}
});

// libraries per run
router.get('/run_info/:_id/libraries', function(req, res) {
	if (req.params._id) {
		library_info.find({RunInfo_name: req.params._id}, function(err, docs) {
			if (err) throw err;
			if (typeof docs[0] !== 'undefined') {
				res.json(docs);
			} else {
				res.json({message: 'Not found'});
			}
		});
	}
});

// workflow_info
// one workflow
router.get('/workflow_info/:_id', function(req, res) {
	if (req.params._id) {
		workflow_info.find({workflow_accession: req.params._id}, function(err, docs) {
			if (err) throw err;
			if (typeof docs[0] !== 'undefined') {
				res.json(docs);
			} else {
				res.json({message: 'Not found'});
			}
		});
	}
});

// files per workflow
router.get('/workflow_info/:_id/files', function(req, res) {
	if (req.params._id) {
		file_info.find({WorkflowInfo_accession: req.params._id}, 'fileSWID file_path', function(err, docs) {
			if (err) throw err;
			if (typeof docs[0] !== 'undefined') {
				res.json(docs);
			} else {
				res.json({message: 'Not found'});
			}
		});
	}
});
//========================================================
//run summary
router.get('/run_summary', function(req, res) {
		res.status(400).send({error:"no sequencer run name given"});
});

//per one run name
router.get('/run_summary/:_id', function(req, res) {
if (req.params._id) {
		library_info.aggregate
([
    { $match: {RunInfo_name:req.params._id}},
    { $group: {
        _id: req.params._id,
        projectSummary: {$addToSet: "$ProjectInfo_name"},//finds all the projects in the run
        librarySummary: {$addToSet: "$library_type"},
        tissueSummary: {$addToSet: "$tissue_type"},
        origin: {$push: "$$ROOT"} }},
    { $unwind: {path:"$projectSummary", preserveNullAndEmptyArrays: true}},
    { $unwind: {path:"$librarySummary", preserveNullAndEmptyArrays: true}},
    { $unwind: {path:"$tissueSummary", preserveNullAndEmptyArrays: true}},
    { $unwind: {path: "$origin", preserveNullAndEmptyArrays: true}},
    { $project: {
         _id: 0,
         projectSum: {$cond: {if:{ $eq:["$projectSummary","$origin.ProjectInfo_name"]},
                            then: 1,
                            else: 0}},
         librarySum: {$cond: {if:{ $eq:["$librarySummary","$origin.library_type"]},
                            then: 1,
                            else: 0}},
         tissueSum: {$cond: {if:{ $eq:["$tissueSummary","$origin.tissue_type"]},
                            then: 1,
                            else: 0}},
         projectSummary: 1,
         librarySummary: 1,
         tissueSummary:1}},
    { $group: {
        _id: {
	    projectSummary: "$projectSummary",
	    tissueSummary: "$tissueSummary",
	    librarySummary: "$librarySummary"},
        projectTotal: { $sum: "$projectSum" },
        libraryTotal: { $sum: "$librarySum"},
        tissueTotal: { $sum: "$tissueSum" },
        libraryCount: {$sum: 1} }},
    { $group: {
        _id:req.params._id,
        libraryCount: {$first: "$libraryCount"},
        projectSummary: { $addToSet: {
            projectCode: "$_id.projectSummary",
            total: "$projectTotal" }},
        librarySummary: { $addToSet: {
            libraryType: "$_id.librarySummary",
            total: "$libraryTotal" }},
        tissueSummary: { $addToSet: {
            tissueType: "$_id.tissueSummary",
            total: "$tissueTotal" }} }},
    { $lookup: {
        from: "RunInfo",			//incorporates run status
        localField: "_id",
        foreignField: "run_name",
        as: "runstatus" }},
    { $unwind: {path:"$runstatus", preserveNullAndEmptyArrays: true}},
    { $project: {
        _id: 0,
        runName: "$_id",
        status: "$runstatus.status",
        start: "$runstatus.start_tstmp",
        libraryCount: 1,
        projectSummary: 1,
        librarySummary: 1,
        tissueSummary: 1 }}
        ],
	function(err, docs) {
			if (err) throw err;
			if (typeof docs[0] !== 'undefined') {
				res.json(docs);
			} else {
						//incorrect run name
				res.status(404).send({error:"sequencer run name not found"});
			}
		});
	}
});

//run workflows
router.get('/run_workflows', function(req, res) {
		res.status(400).send({error:"no sequencer run name given"});
});

//per one run name-first 10
router.get('/run_workflows/:_id', function(req, res) {
	if (req.params._id) {
		library_info.aggregate
([
    { $match: {RunInfo_name:req.params._id}},
    { $group: {
        _id: req.params._id,
        origin: {$push: "$$ROOT"} }},
    { $unwind: {path: "$origin", preserveNullAndEmptyArrays: true}},
    { $sort: {"origin.lane": 1, "origin.library_name": 1}},
    { $limit: 10},				//only works with the first 10 libraries
    { $unwind: {path: "$origin.WorkflowInfo_accession", preserveNullAndEmptyArrays: true}},
    { $lookup: {
        from: "WorkflowInfo",
        localField: "origin.WorkflowInfo_accession",
        foreignField: "sw_accession",
        as: "workflows" }},
     { $unwind: {path: "$workflows", preserveNullAndEmptyArrays: true}},
     { $lookup: {
        from: "FileInfo",
        localField: "origin.WorkflowInfo_accession",
        foreignField: "WorkflowInfo_accession",
        as: "files" }},
     { $unwind: {path: "$files", preserveNullAndEmptyArrays: true}},
     { $group: {
         _id: { accession:"$origin.WorkflowInfo_accession", iusswid: "$origin.iusswid"},
         files: {$first: "$files"},
         "fileSum": {$sum: 1},
         workflows: {$first: "$workflows"},
         origin: {$first: "$origin"} }},
     { $group: {
         _id: "$origin.iusswid",
         origin: {$first: "$origin"},
         workflowCount: {$sum: 1},
         workflows: {$push: {
             "WorkflowInfo": "$workflows",
             "fileCount": {$cond: {if:{ $eq:["$files",null]},
				then: 0,	//if there are no files for the workflow
				else: "$fileSum"}}
              }} }},
    { $group: {
        _id:req.params._id,
        libraryCount: {$sum: 1},
        libraries: {$push: {
            library_name: "$origin.library_name",
             lane: "$origin.lane",
             barcode: "$origin.barcode",
             tissue_type: "$origin.tissue_type",
             workflowCount: "$workflowCount",
             workflows: "$workflows"}} }},
    { $sort: {"lane": 1, "libraries.library_name": 1}}
        ],
	function(err, docs) {
			if (err) throw err;
			if (typeof docs[0] !== 'undefined') {
				res.json(docs);
			} else {
						//incorrect run name
				res.status(404).send({error:"sequencer run name not found"});
			}
		});
	}
});

//workflows per one run - ten libraries at a time
router.get('/run_workflows/:_id/:start', function(req, res) {
	if (req.params._id && req.params.start) {
	req.params.start=parseInt(req.params.start);
		library_info.aggregate
([
    { $match: {RunInfo_name:req.params._id}},
    { $group: {
        _id: req.params._id,
        origin: {$push: "$$ROOT"} }},
    { $unwind: {path: "$origin", preserveNullAndEmptyArrays: true}},
    { $sort: {"origin.lane": 1, "origin.library_name": 1}},
    { $skip: req.params.start},
    { $limit: 10},
    { $unwind: {path: "$origin.WorkflowInfo_accession", preserveNullAndEmptyArrays: true}},
    { $lookup: {
        from: "WorkflowInfo",
        localField: "origin.WorkflowInfo_accession",
        foreignField: "sw_accession",
        as: "workflows" }},
     { $unwind: {path: "$workflows", preserveNullAndEmptyArrays: true}},
     { $lookup: {
        from: "FileInfo",
        localField: "origin.WorkflowInfo_accession",
        foreignField: "WorkflowInfo_accession",
        as: "files" }},
     { $unwind: {path: "$files", preserveNullAndEmptyArrays: true}},
     { $group: {
         _id: { accession:"$origin.WorkflowInfo_accession", iusswid: "$origin.iusswid"},
         files: {$first: "$files"},
         "fileSum": {$sum: 1},
         workflows: {$first: "$workflows"},
         origin: {$first: "$origin"} }},
     { $group: {
         _id: "$origin.iusswid",
         origin: {$first: "$origin"},
         workflowCount: {$sum: 1},
         workflows: {$push: {
             "WorkflowInfo": "$workflows",
             "fileCount": {$cond: {if:{ $eq:["$files",null]},
				then: 0,
				else: "$fileSum"}}
              }} }},
    { $group: {
        _id:req.params._id,
        libraryCount: {$sum: 1},
        libraries: {$push: {
            library_name: "$origin.library_name",
             lane: "$origin.lane",
             barcode: "$origin.barcode",
             tissue_type: "$origin.tissue_type",
             workflowCount: "$workflowCount",
             workflows: "$workflows"}} }},
    { $sort: {"lane": 1, "libraries.library_name": 1}}
        ],
	function(err, docs) {
			if (err) throw err;
			if (typeof docs[0] !== 'undefined') {
				res.json(docs);
			} else {
						//incorrect run name
				res.status(404).send({error:"sequencer run name not found or starting value larger than the amount of libraries"});
			}
		});
	}
});

//run_details
						//if run name not given
router.get('/run_details', function(req, res) {
		res.status(400).send({error:"no sequencer run name given"});
});

//per one run name
router.get('/run_details/:_id', function(req, res) {
	if (req.params._id) {
		library_info.aggregate
([
    { $match: {RunInfo_name:req.params._id}},
   { $lookup: {
        from: "QC",
        localField: "iusswid",
        foreignField: "iusswid",
        as: "qc" }},
     { $unwind: {path: "$qc", preserveNullAndEmptyArrays: true}},
    { $group: {
        _id: {					//combines the reruns of the same iusswid
            iusswid: "$iusswid",
            lane: "$lane",
            library_name:"$library_name"},
        "yield": {$sum: "$qc.Yield"},
        "reads": {$sum: "$qc.Reads"},
        "lane": {$first: "$lane"},
	"library_name": {$first: "$library_name"},
        "qc": {$push: "$qc"}}},
    { $project: {
        "hasQC": {$cond: {if:{ $eq:["$yield",0]},//for determining status
				then: 0,
				else: 1}},
        "yield": 1,
        "reads": 1,
        "lane": 1,
        "library_name": 1,
        "qc": 1}},
    { $group: {
        _id: "$lane",				//separates acording to the lane
        "libraryCount": {$sum: 1},
        "yieldSum": {$sum: "$yield"},
        "readsSum": {$sum: "$reads"},
        "sumHasQC": {$sum: "$hasQC"},
        "libraries": {$push: {libraryName: "$library_name", qc: "$qc"}} }},
    { $sort: {_id: 1}},
     { $group: {
        _id: req.params._id,
        "lanes": {$push:{
            lane: "$_id",
            libraryCount: "$libraryCount",
            yieldSum: "$yieldSum",
            readsSum: "$readsSum",
            "laneQCStatus": {$cond: {if:{ $lt:["$sumHasQC","$libraryCount"]},
				then: "in progress",
				else: "complete"}},
            "laneCompleteQC": {$cond: {if:{ $lt:["$sumHasQC","$libraryCount"]},
				then: 0,
				else: 1}},
            libraries: "$libraries"}},
        "laneSum": {$sum: 1},
        "total yield sum": {$sum: "$yieldSum"},
        "total reads sum": {$sum: "$readsSum"},
        }},
    { $lookup: {
        from: "RunInfo",			//incorporates run status
        localField: "_id",
        foreignField: "run_name",
        as: "runstatus" }},
    { $unwind: {path:"$runstatus", preserveNullAndEmptyArrays: true}},
    { $project: {
        "_id": 1,
        "runStatus": "$runstatus.status",
        "TotalLibraries": {$sum: "$lanes.libraryCount"},
        "total yield sum": 1,
        "total reads sum": 1,
        "statusSum":1,
        "runQCStatus":  {$cond: {if:{ $eq:[{$sum: "$lanes.laneCompleteQC"},"$laneSum"]},
				then: "completed",
				else: "in progress"}},
        "lanes": 1}}
        ],
	function(err, docs) {
			if (err) throw err;
			if (typeof docs[0] !== 'undefined') {
				res.json(docs);
			} else {
						//incorrect run name
				res.status(404).send({error:"sequencer run name not found"});
			}
		});
	}
});

// ========================================================
// Register routes
app.use('/api', router);

// Start the server
app.listen(port);
console.log('Magic happens on port ' + port);

function findById(_id, collection) {
	if (req.params._id) {
		collection.find({_id: req.params._id}, function(err, docs) {
			if (err) throw err;
			if (typeof docs[0] !== 'undefined') {
				res.json(docs);
			} else {
				res.json({message: 'Not found'});
			}
		});
	}
}
