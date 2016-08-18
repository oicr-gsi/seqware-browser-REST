var	mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var mongoose = require('mongoose');
var fs = require('fs');

var chai = require('chai');
var request = require("request");
var assert = chai.assert;
var expect = chai.expect;

var test = require('unit.js');
var server;

var host = process.env.npm_config_mongo_db_for_testing;
var randomNum = parseInt(Math.random()*100000);
var database = "test_"+ randomNum;
var mongourl = 'mongodb://' + host + '/'+ database;

describe('server API:', function() {
	//preload database with data
	before ('make config.js, connect to mongoDB, create collections', function(done) {
		if(host==undefined) {
			test.fail('mongo address was not entered correctly: npm --mongo_db_for_testing=_______ test');
		}
		MongoClient.connect(mongourl, function(err, db) {
			if(db==null) {
				test.fail('incorrect address entered');
			}
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
			db.collection('RunReportData').insert({'run_name': "100000_A100_10000_100AA_AA", 'lanes': lanes});
			db.collection('RunInfo').insert({'status':"Completed", 'run_name': "100000_A100_10000_100AA_AA"});
			db.collection('QC').insert(libraryArray, function() {
				db.collection('LibraryInfo').insert(qcArray, function() {
					var stream = fs.createWriteStream("./test/tmp/config.js");
					stream.once('open', function(fd) {
						var line1 = "var config = {};\n";
						var line2 = "config.mongo = {};\n";
						var line3 = "config.mongo.host = '"+host+"';\n";
						var line4 = "config.mongo.database = '"+database+"';\n";
						var line5 = "module.exports = config;\n";
						var final = line1.concat(line2, line3, line4, line5);
						stream.write(final);
						stream.end();
						server = require('../server');
						db.close();
						done();
					});
				});
			});
		});
	});
	after ('drop database', function(done) {
		if(host==undefined) {
			test.fail('mongo address was not entered correctly: npm --mongo_db_for_testing=_______ test');
		}
		MongoClient.connect(mongourl, function(err, db) {
			if(db==null) {
				test.fail('incorrect address entered');
			}
			db.dropDatabase();
			db.close();
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
			console.log(obj[0]);
			test.object(obj[0])
				.hasProperty('_id', '100000_A100_10000_100AA_AA')
				.hasProperty('run_qc_status', 'completed')
				.hasProperty('total_yield_sum', 250)
				.hasProperty('total_libraries', 5)
			done();
		});
	});
	//includes all projects listed under the run
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
				test.object(obj[0]['lanes'][0]['projects'][1]).hasProperty('project_name', 'PCSI');
				test.object(obj[0]['lanes'][0]['projects'][0]).hasProperty('project_name', 'EPIC');
				done();
			});
		});
	});
	//in progress status when qc information not complete
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
				done();
			});
		});
	});
	//returns correct errors
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