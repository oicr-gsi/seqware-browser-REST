// curl http://localhost:10010/run_workflows_summary\?run\=130531_SN1080_0136_BC1F7AACXX


'use strict';

//should lead to libraryInfo
var util = require('util');
var request = require ('request');

module.exports = {
    projectOverviewSummary:projectOverviewSummary,
    projectOverviewLibraries:projectOverviewLibraries,
    projectOverviewPending:projectOverviewPending,
    projectOverview:projectOverview,
    projectRuns:projectRuns,
    runTimeframeSummaryRunning:runTimeframeSummaryRunning,
    runTimeframeSummaryLibraries:runTimeframeSummaryLibraries,
    runTimeframeSummaryPending:runTimeframeSummaryPending,
    runTimeframe:runTimeframe,
    runWorkflowsSummary: runWorkflowsSummary,
    runWorkflows: runWorkflows,
    runDetails: runDetails,
    allProjects:allProjects,
    projectStatusSummary:projectStatusSummary,
    projectStatus:projectStatus,
    donorWorkflowsSummary:donorWorkflowsSummary,
    donorWorkflows:donorWorkflows,
    donorDetails:donorDetails
};

function projectOverviewSummary(req, res) {
    var projectArray = req.swagger.params.projects.value;
    var url = "http://localhost:8080/api/project_overview_summary/"+projectArray;
    console.log ('executing request: '+url)
    request.get(url).pipe(res);
}
function projectOverviewLibraries(req, res) {
    var projectArray = req.swagger.params.projects.value;
    var url = "http://localhost:8080/api/project_overview_libraries/"+projectArray;
    console.log ('executing request: '+url)
    request.get(url).pipe(res);
}
function projectOverviewPending(req, res) {
    var projectArray = req.swagger.params.projects.value;
    var url = "http://localhost:8080/api/project_overview_pending/"+projectArray;
    console.log ('executing request: '+url)
    request.get(url).pipe(res);
}
function projectOverview(req, res) {
    var projectArray = req.swagger.params.projects.value;
    var url = "http://localhost:8080/api/project_overview/"+projectArray;
    console.log ('executing request: '+url)
    request.get(url).pipe(res);
}
function projectRuns(req, res) {
    var projectArray = req.swagger.params.projects.value;
    var url = "http://localhost:8080/api/project_runs/"+projectArray;
    console.log ('executing request: '+url)
    request.get(url).pipe(res);
}
function runTimeframeSummaryRunning(req, res) {
    var startTime = req.swagger.params.start.value;
    var endTime = req.swagger.params.end.value;
    var url = "http://localhost:8080/api/run_timeframe_summary_running/"+startTime+"/"+endTime;
    console.log ('executing request: '+url)
    request.get(url).pipe(res);
}
function runTimeframeSummaryLibraries(req, res) {
    var startTime = req.swagger.params.start.value;
    var endTime = req.swagger.params.end.value;
    var url = "http://localhost:8080/api/run_timeframe_summary_libraries/"+startTime+"/"+endTime;
    console.log ('executing request: '+url)
    request.get(url).pipe(res);
}
function runTimeframeSummaryPending(req, res) {
    var startTime = req.swagger.params.start.value;
    var endTime = req.swagger.params.end.value;
    var url = "http://localhost:8080/api/run_timeframe_summary_pending/"+startTime+"/"+endTime;
    console.log ('executing request: '+url)
    request.get(url).pipe(res);
}
function runTimeframe(req, res) {
    var startTime = req.swagger.params.start.value;
    var endTime = req.swagger.params.end.value;
    var url = "http://localhost:8080/api/run_timeframe/"+startTime+"/"+endTime;
    console.log ('executing request: '+url)
    request.get(url).pipe(res);
}
function runWorkflowsSummary(req, res) {
    var runName = req.swagger.params.run.value;
    var url = "http://localhost:8080/api/run_workflows_summary/"+runName;
    console.log ('executing request: '+url)
    request.get(url).pipe(res);
}
function runWorkflows(req, res) {
    var runName = req.swagger.params.run.value;
    var url = "http://localhost:8080/api/run_workflows/"+runName;
    console.log ('executing request: '+url)
    request.get(url).pipe(res);
}
function runDetails(req, res) {
    var runName = req.swagger.params.run.value;
    var url = "http://localhost:8080/api/run_details/"+runName;
    console.log ('executing request: '+url)
    request.get(url).pipe(res);
}
function allProjects(req, res) {
    var url = "http://localhost:8080/api/all_projects/";
    console.log ('executing request: '+url)
    request.get(url).pipe(res);
}
function projectStatusSummary(req, res) {
    var project = req.swagger.params.project.value;
    var url = "http://localhost:8080/api/project_status_summary/"+project;
    console.log ('executing request: '+url)
    request.get(url).pipe(res);
}
function projectStatus(req, res) {
    var project = req.swagger.params.project.value;
    var url = "http://localhost:8080/api/project_status/"+project;
    console.log ('executing request: '+url)
    request.get(url).pipe(res);
}
function donorWorkflowsSummary(req, res) {
    var donorName = req.swagger.params.donor.value;
    var url = "http://localhost:8080/api/donor_workflows_summary/"+donorName;
    console.log ('executing request: '+url)
    request.get(url).pipe(res);
}
function donorWorkflows(req, res) {
    var donorName = req.swagger.params.donor.value;
    var url = "http://localhost:8080/api/donor_workflows/"+donorName;
    console.log ('executing request: '+url)
    request.get(url).pipe(res);
}
function donorDetails(req, res) {
    var donorName = req.swagger.params.donor.value;
    var url = "http://localhost:8080/api/donor_details/"+donorName;
    console.log ('executing request: '+url)
    request.get(url).pipe(res);
}