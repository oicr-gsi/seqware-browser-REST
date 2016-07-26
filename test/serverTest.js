var	mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var mongoose = require('mongoose');

var chai = require('chai');
//var chaiHttp=require('chai-http');
var request = require("request");
var assert = chai.assert;
var expect = chai.expect;

//chai.use(chaiHttp);

var test = require('unit.js');
var server = require('../server');
var mongourl = 'mongodb://10.30.128.97/dev_db_2';
//mongoose.connect('mongodb://10.30.128.97:27017/dev_db', function (err) {
 //   if (err) console.error(err);
//});

describe('server API:', function() {
	before ('connect to mongoDB, create collections', function(done) {
		MongoClient.connect(mongourl, function(err, db) {
			db.collection('QC').remove({});
			db.collection('LibraryInfo').remove({});
			db.collection('RunReportData').remove({});
			db.collection('RunInfo').remove({});
			var qcArray = [];
			var libraryArray = [];
			var lanes =[];
			for (i=0; i<5;i++) {
				qcArray[i]={};
				qcArray[i]['library_name']=i+"_name";
				qcArray[i]['iusswid'] = i+"123";
				qcArray[i]['lane'] = i+1;
				qcArray[i]['project_info_name'] = "PCSI";
				qcArray[i]['run_info_name'] = "100000_A100_10000_100AA_AA";
				libraryArray[i]={};
				libraryArray[i]['yield']=50;
				libraryArray[i]['reads'] = 5;
				libraryArray[i]['iusswid'] = i+"123";
				lanes[i]={};
				lanes[i]['lane']=i+1;
				lanes[i]['r1_phasing'] = 0.11;
				lanes[i]['r1_prephasing'] = 0.12;
			}
			db.collection('QC').insert(libraryArray);
			db.collection('LibraryInfo').insert(qcArray);
			db.collection('RunReportData').insert({'run_name': "100000_A100_10000_100AA_AA", 'lanes': lanes});
			db.collection('RunInfo').insert({'status':"Completed", 'run_name': "100000_A100_10000_100AA_AA"});
			done();
		});
	});
	it('connected to server.js', function(done) {
		request("http://localhost:8080/api/", function(error, response, body) {
			expect(response.statusCode).to.equal(200);
			var obj = JSON.parse(body);
			test.object(obj).hasProperty('message', "yay!! welcome to the api!");
			done();
		});		
	});
	it('get all of the required information from a normal query call', function(done) {
		request("http://localhost:8080/api/run_details/100000_A100_10000_100AA_AA", function(error, response, body) {
			expect(response.statusCode).to.equal(200);
			var obj = JSON.parse(body);
			test.object(obj[0])
				.hasProperty('_id', '100000_A100_10000_100AA_AA')
				.hasProperty('run_qc_status', 'completed')
				.hasProperty('total_yield_sum', 250)
				.hasProperty('total_libraries', 5)
				.hasLength(9);
			done();
		});
	});
	it('multiple projects in a lane', function(done) {
		MongoClient.connect(mongourl, function(err, db) {
			db.collection('QC').insert({'yield': 50, 'reads': 50, 'iusswid': "1234"});
			db.collection('LibraryInfo').insert({'library_name': "11_name", 'iusswid': "1234", 'lane': 1, 'run_info_name': "100000_A100_10000_100AA_AA" , 'project_info_name': "EPIC"});
			
			request("http://localhost:8080/api/run_details/100000_A100_10000_100AA_AA", function(error, response, body) {
				expect(response.statusCode).to.equal(200);
				var obj = JSON.parse(body);
				test.object(obj[0])
					.hasProperty('run_qc_status', 'completed')
					.hasProperty('total_yield_sum', 300)
					.hasProperty('total_libraries', 6)
					.hasLength(9);
				test.object(obj[0]['lanes'][0]['projects'][1]).hasProperty('project_name', 'PCSI');
				test.object(obj[0]['lanes'][0]['projects'][0]).hasProperty('project_name', 'EPIC');
				done();
			});
		});
	});
	it('one qc is missing/incomplete, checking status', function(done) {
		MongoClient.connect(mongourl, function(err, db) {
			db.collection('QC').remove({'iusswid': "2123"});

			request("http://localhost:8080/api/run_details/100000_A100_10000_100AA_AA", function(error, response, body) {
				expect(response.statusCode).to.equal(200);
				var obj = JSON.parse(body);
				test.object(obj[0])
					.hasProperty('run_qc_status', 'in progress')
					.hasProperty('total_yield_sum', 250)
					.hasProperty('total_libraries', 6)
					.hasLength(9);
				done();
			});
		});
	});
	it('no QC collection information', function(done) {
		MongoClient.connect(mongourl, function(err, db) {
			db.collection('QC').remove({});

			request("http://localhost:8080/api/run_details/100000_A100_10000_100AA_AA", function(error, response, body) {
				expect(response.statusCode).to.equal(200);
				var obj = JSON.parse(body);
				test.object(obj[0])
					.hasProperty('run_qc_status', 'in progress')
					.hasProperty('total_yield_sum', 0)
					.hasProperty('total_libraries', 6)
					.hasLength(9);
				done();
			});
		});
	});
	it('run is not found in the LibraryInfo collection', function(done) {
		request("http://localhost:8080/api/run_details/100000_A100_10000_100AA_BB", function(error, response, body) {
			expect(response.statusCode).to.equal(404);
			done();
		});
	});
	it('no run name given', function(done) {
		request("http://localhost:8080/api/run_details", function(error, response, body) {
			expect(response.statusCode).to.equal(400);
			done();
		});
	});
});