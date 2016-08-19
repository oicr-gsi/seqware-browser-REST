Seqware-Browser-REST
================

REST endpoints to query mongodb for reporting app
---
###Requirements
*mongodb version must be at least 3.0 to be able to perform $lookup in the aggregation
*node.js must be installed, followed by npm
### Set Up and Running
serverConnect.js starts the connection to mongodb, and then calls server.js which contains all the endpoints. the package.json points npm start to serverConnect.js. 
```
npm install
npm --host=host_address --database=database_name --web_port=port_number start
```
Including the port number for the url is optional. It will otherwise be set to port 8080.
---
### Testing
First install the required node modules then run the test: 
```
npm install
export NODE_PATH=path_to_tmp/test
npm --mongo_db_for_testing=host_address test
//or
npm --mongo_db_for_testing=host_address --web_port=port_number test
```
### Swagger Documentation
queries.js points to port 8080 to retrieve the endpoints from server.js, this may be changed depending on where server.js is running.
To run the documentation (assuming set up was complete):
```
host=host_address database=database_name swagger project start
```
as environment variables, you can also add PORT for where swagger will end up, and web_port for the api port. (if changing web_port, queries.js must be updated too)
A link will pop up in the command line. go to that link and add /docs to the end.

The expected output to the console:
```
Starting: /home/<name>/seqware-browser-REST/serverConnect.js...
  project started here: http://localhost:10010/
  project will restart on changes.
  to restart at any time, enter `rs`
Magic happens on port 8080
```