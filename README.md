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
This file should be added to the node path.

run npm install to get the node modules before running this project
---
### Testing
First install the required node modules then run the test: 
```
npm install
export NODE_PATH=path_to_seqware-browser-REST
env KEY=mongo_address npm test
```
### Swagger documentation
Before running, configure the db.js file to mongodb and the corresponding database.
queries.js points to port 8080 to retrieve the endpointsfrom server.js, this may be changed depending on where server.js is running.
To run the documentation (assuming set up was complete):
```
swagger project start
```
A link will pop up. go to that link and add /docs to the end.