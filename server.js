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