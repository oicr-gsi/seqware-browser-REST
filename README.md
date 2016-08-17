Seqware-Browser-REST
================

REST endpoints to query mongodb for reporting app

### Set Up
This project requires a config.js file to retrieve the database and host information. The file should look like this: 
```
var config = {};

config.mongo = {};

config.mongo.host = '10.30.128.97';
config.mongo.database = 'sqwdev';

module.exports = config;
```
This file should be added to the node path
---
### Testing
First install the required node modules then run the test: 
```
npm install
export NODE_PATH=path_to_seqware-browser-REST
env KEY=mongo_address npm test
```