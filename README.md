Seqware-Browser-REST
================

REST endpoints to query mongodb for reporting app
---
###Requirements
- mongodb version must be at least 3.0 to be able to perform $lookup in the aggregation
- node.js must be installed, followed by npm

---
### Set Up and Running
serverConnect.js starts the connection to mongodb, and then calls server.js which contains all the endpoints. package.json points npm start to serverConnect.js. 
```
npm install
npm --host=host_address --database=database_name --api_port=port_number web_address=host_and_port_of_landing_server start
```
- Including the port number for the url is optional. It will otherwise be set to port 8081.
- The web address should be pointing to where the application itself is running, otherwise it will be set to http://localhost:8080.
- Mongo host and address must be provided through the environment variables.

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
---
### Swagger Documentation
queries.js points to port 8080 to retrieve the endpoints from server.js, this may be changed depending on where server.js is running.
To run the documentation (assuming set up was complete):
```
host=host_address database=database_name --api_port=8080 swagger project start
```
as environment variables, you can also add PORT for where swagger will end up, and api_port for where server.js will run from. (if changing web_port, queries.js must be updated too)
A link will pop up in the command line. go to that link and add /docs to the end.

The expected output to the console:
```
Starting: /home/<name>/seqware-browser-REST/serverConnect.js...
  project started here: http://localhost:10010/
  project will restart on changes.
  to restart at any time, enter `rs`
Magic happens on port 8080
```