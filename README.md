Seqware-Browser-REST
================

REST endpoints to query mongodb for reporting app

### Set Up and Running
serverConnect.js starts the connection to mongodb, and then calls server.js which contains all the endpoints. the package.json points npm start to serverConnect.js. 
```
npm install
npm --host=host_address --database=database_name --port=port_number start
```
Including the port number is optional. It will otherwise be set to port 8080.
---
### Testing
First install the required node modules then run the test: 
```
npm install
export NODE_PATH=path_to_tmp/test
npm --mongo_db_for_testing=host_address test
```
### Swagger documentation
Before running, configure the db.js file to mongodb and the corresponding database.
queries.js points to port 8080 to retrieve the endpointsfrom server.js, this may be changed depending on where server.js is running.
To run the documentation (assuming set up was complete):
```
swagger project start
```
A link will pop up. go to that link and add /docs to the end.