'use strict;'

//exports.db_url = 'mongodb://10.30.128.97:27017/seqwareBrowser';
var mongoose = require('mongoose');
var db = mongoose.connect ('mongodb://' + config.mongo.host + '/' + config.mongo.database);
