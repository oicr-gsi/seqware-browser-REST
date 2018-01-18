'use strict';

process.env.NODE_ENV = 'test';

const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const server = require('../server');

chai.use(chaiHttp);

describe('new RunReport', () => {
  it('it should GET /api/', (done) => {
    chai.request(server)
      .get('/api/')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.errors).to.be.undefined;
        expect(res.body).not.to.deep.equal([]);
        done();
      });
  });
  it('it should GET /api/current_workflow_runs', (done) => {
    chai.request(server)
      .get('/api/current_workflow_runs')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.errors).to.be.undefined;
        expect(res.body).not.to.deep.equal([]);
        done();
      });
  });
  it('it should GET /api/project_info', (done) => {
    chai.request(server)
      .get('/api/project_info')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.errors).to.be.undefined;
        expect(res.body).not.to.deep.equal([]);
        done();
      });
  });
  it('it should GET /api/project_info/:projectName', (done) => {
    chai.request(server)
      .get('/api/project_info/ACC')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.errors).to.be.undefined;
        expect(res.body).not.to.deep.equal([]);
        done();
      });
  });
  it('it should GET /api/project_info/:projectName/libraries', (done) => {
    chai.request(server)
      .get('/api/project_info/PCSI/libraries')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.errors).to.be.undefined;
        expect(res.body).not.to.deep.equal([]);
        done();
      });
  });
  it('it should GET /api/donor_info', (done) => {
    chai.request(server)
      .get('/api/donor_info')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.errors).to.be.undefined;
        expect(res.body).not.to.deep.equal([]);
        done();
      });
  });
  it('it should GET /api/donor_info/:donorName', (done) => {
    chai.request(server)
      .get('/api/donor_info/PCSI_0006')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.errors).to.be.undefined;
        expect(res.body).not.to.deep.equal([]);
        done();
      });
  });
  it('it should GET /api/donor_info/:donorName/libraries', (done) => {
    chai.request(server)
      .get('/api/donor_info/PCSI_0006/libraries')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.errors).to.be.undefined;
        expect(res.body).not.to.deep.equal([]);
        done();
      });
  });
  it('it should GET /api/run_count/:runName', (done) => {
    chai.request(server)
      .get('/api/run_count/090430_I280_302DW_5')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.errors).to.be.undefined;
        expect(res.body).not.to.deep.equal([]);
        done();
      });
  });
  it('it should GET /api/run_info/:runName/libraries', (done) => {
    chai.request(server)
      .get('/api/run_info/090430_I280_302DW_5/libraries')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.errors).to.be.undefined;
        expect(res.body).not.to.deep.equal([]);
        done();
      });
  });
  it('it should GET /api/library_info', (done) => {
    chai.request(server)
      .get('/api/library_info')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.errors).to.be.undefined;
        expect(res.body).not.to.deep.equal([]);
        done();
      });
  }).timeout(5000);
  it('it should GET /api/library_info/:libraryName', (done) => {
    chai.request(server)
      .get('/api/library_info/090430_I280_302DW_5%7C%7C6%7C%7C859')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.errors).to.be.undefined;
        expect(res.body).not.to.deep.equal([]);
        done();
      });
  });
  it('it should GET /api/library_info/:libraryName/workflows', (done) => {
    chai.request(server)
      .get('/api/library_info/090430_I280_302DW_5%7C%7C6%7C%7C859/workflows')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.errors).to.be.undefined;
        expect(res.body).not.to.deep.equal([]);
        done();
      });
  });
  it('it should GET /api/run_info', (done) => {
    chai.request(server)
      .get('/api/run_info')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.errors).to.be.undefined;
        expect(res.body).not.to.deep.equal([]);
        done();
      });
  });
  it('it should GET /api/run_info/:runName', (done) => {
    chai.request(server)
      .get('/api/run_info/090430_I280_302DW_5')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.errors).to.be.undefined;
        expect(res.body).not.to.deep.equal([]);
        done();
      });
  });
  it('it should GET /api/workflow_info/:workflowAccession', (done) => {
    chai.request(server)
      .get('/api/workflow_info/3452850')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.errors).to.be.undefined;
        expect(res.body).not.to.deep.equal([]);
        done();
      });
  });
  it('it should GET /api/workflow_info/:workflowAccession/files', (done) => {
    chai.request(server)
      .get('/api/workflow_info/3452850')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.errors).to.be.undefined;
        expect(res.body).not.to.deep.equal([]);
        done();
      });
  });
  it('it should GET /api/run_timeframe_summary_running', (done) => {
    chai.request(server)
      .get('/api/run_timeframe_summary_running')
      .end((err, res) => {
        expect(res.status).to.equal(400);
        done();
      });
  });
  it('it should GET /api/run_timeframe_summary_running/:start/:end', (done) => {
    chai.request(server)
      .get('/api/run_timeframe_summary_running/2016-01-01/2017-01-09')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.errors).to.be.undefined;
        expect(res.body).not.to.deep.equal([]);
        done();
      });
  });
  it('it should GET /api/run_timeframe_summary_libraries', (done) => {
    chai.request(server)
      .get('/api/run_timeframe_summary_libraries')
      .end((err, res) => {
        expect(res.status).to.equal(400);
        done();
      });
  });
  it('it should GET /api/run_timeframe_summary_libraries/:start/:end', (done) => {
    chai.request(server)
      .get('/api/run_timeframe_summary_libraries/2009-07-25/2009-07-30')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.errors).to.be.undefined;
        expect(res.body).not.to.deep.equal([]);
        done();
      });
  });
  it('it should GET /api/run_timeframe_summary_pending', (done) => {
    chai.request(server)
      .get('/api/run_timeframe_summary_pending')
      .end((err, res) => {
        expect(res.status).to.equal(400);
        done();
      });
  });
  it('it should GET /api/run_timeframe_summary_pending/:start/:end', (done) => {
    chai.request(server)
      .get('/api/run_timeframe_summary_pending/2009-07-25/2009-07-30')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.errors).to.be.undefined;
        // we never use "pending" run status, hence the empty response
        expect(res.body).to.deep.equal([]);
        done();
      });
  });
  it('it should GET /api/run_timeframe', (done) => {
    chai.request(server)
      .get('/api/run_timeframe')
      .end((err, res) => {
        expect(res.status).to.equal(400);
        done();
      });
  });
  it('it should GET /api/run_timeframe/:start/:end', (done) => {
    chai.request(server)
      .get('/api/run_timeframe/2009-07-25/2009-07-30')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.errors).to.be.undefined;
        expect(res.body).not.to.deep.equal([]);
        done();
      });
  });
  it('it should GET /api/project_runs/:projectNames', (done) => {
    chai.request(server)
      .get('/api/project_runs/ACC,AOE')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.errors).to.be.undefined;
        expect(res.body).not.to.deep.equal([]);
        done();
      });
  });
  it('it should GET /api/project_overview_summary', (done) => {
    chai.request(server)
      .get('/api/project_overview_summary')
      .end((err, res) => {
        expect(res.status).to.equal(400);
        done();
      });
  });
  it('it should GET /api/project_overview_summary/:projectNames workflow data created in past week', (done) => {
    chai.request(server)
      .get('/api/project_overview_summary/ACC,AOE')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.errors).to.be.undefined;
        // this only returns data from the past week. Current test data is older, hence the empty response
        expect(res.body).to.deep.equal([]);
        done();
      });
  });
  it('it should GET /api/project_overview_libraries', (done) => {
    chai.request(server)
      .get('/api/project_overview_libraries')
      .end((err, res) => {
        expect(res.status).to.equal(400);
        done();
      });
  });
  it('it should GET /api/project_overview_libraries/:projectNames', (done) => {
    chai.request(server)
      .get('/api/project_overview_libraries/ACC,AOE')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.errors).to.be.undefined;
        expect(res.body).not.to.deep.equal([]);
        done();
      });
  });
  it('it should GET /api/project_overview_pending', (done) => {
    chai.request(server)
      .get('/api/project_overview_pending')
      .end((err, res) => {
        expect(res.status).to.equal(400);
        done();
      });
  });
  it('it should GET /api/project_overview_pending/:projectNames libraries for pending runs', (done) => {
    chai.request(server)
      .get('/api/project_overview_pending/ACC,AOE')
      .end((err, res) => {
        // we never use pending runs, so there should never be any
        expect(res.status).to.equal(200);
        expect(res.body.errors).to.be.undefined;
        // we never use "pending" run status, hence the empty response
        expect(res.body).to.deep.equal([]);
        done();
      });
  });
  it('it should GET /api/project_overview', (done) => {
    chai.request(server)
      .get('/api/project_overview')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.errors).to.be.undefined;
        expect(res.body).not.to.deep.equal([]);
        done();
      });
  });
  it('it should GET /api/project_overview/:projectNames', (done) => {
    chai.request(server)
      .get('/api/project_overview/ACC,AOE')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.errors).to.be.undefined;
        expect(res.body).not.to.deep.equal([]);
        done();
      });
  });
  it('it should GET /api/run_workflows_summary', (done) => {
    chai.request(server)
      .get('/api/run_workflows_summary')
      .end((err, res) => {
        expect(res.status).to.equal(400);
        done();
      });
  });
  it('it should GET /api/run_workflows_summary/:runName', (done) => {
    chai.request(server)
      .get('/api/run_workflows_summary/090430_I280_302DW_5')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.errors).to.be.undefined;
        expect(res.body).not.to.deep.equal([]);
        done();
      });
  });
  it('it should GET /api/run_workflows', (done) => {
    chai.request(server)
      .get('/api/run_workflows')
      .end((err, res) => {
        expect(res.status).to.equal(400);
        done();
      });
  });
  it('it should GET /api/run_workflows/:runName', (done) => {
    chai.request(server)
      .get('/api/run_workflows/141016_SN7001205_0252_AHAL1FADXX')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.errors).to.be.undefined;
        expect(res.body).not.to.deep.equal([]);
        done();
      });
  }).timeout(10000);
  it('it should GET /api/run_workflows/:runName/:libNum', (done) => {
    chai.request(server)
      .get('/api/run_workflows/141016_SN7001205_0252_AHAL1FADXX/1')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.errors).to.be.undefined;
        expect(res.body).not.to.deep.equal([]);
        done();
      });
  }).timeout(10000);
  it('it should GET /api/run_list', (done) => {
    chai.request(server)
      .get('/api/run_list')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.errors).to.be.undefined;
        expect(res.body).not.to.deep.equal([]);
        done();
      });
  });
  it('it should GET /api/run_details', (done) => {
    chai.request(server)
      .get('/api/run_details')
      .end((err, res) => {
        expect(res.status).to.equal(400);
        done();
      });
  });
  it('it should GET /api/run_details/:runName', (done) => {
    chai.request(server)
      .get('/api/run_details/090430_I280_302DW_5')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.errors).to.be.undefined;
        expect(res.body).not.to.deep.equal([]);
        done();
      });
  });
  it('it should GET /api/run_report_info/:runName/', (done) => {
    chai.request(server)
      .get('/api/run_report_info/090430_I280_302DW_5')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.errors).to.be.undefined;
        expect(res.body).not.to.deep.equal([]);
        done();
      });
  });
  it('it should GET /api/run_details_split', (done) => {
    chai.request(server)
      .get('/api/run_details_split')
      .end((err, res) => {
        expect(res.status).to.equal(400);
        done();
      });
  });
  it('it should GET /api/run_details_split/:runName/:one/:two', (done) => {
    chai.request(server)
      .get('/api/run_details_split/090430_I280_302DW_5/2/3')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.errors).to.be.undefined;
        expect(res.body).not.to.deep.equal([]);
        done();
      });
  });
  it('it should GET /api/all_projects', (done) => {
    chai.request(server)
      .get('/api/all_projects')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.errors).to.be.undefined;
        expect(res.body).not.to.deep.equal([]);
        done();
      });
  });
  it('it should GET /api/project_status', (done) => {
    chai.request(server)
      .get('/api/project_status')
      .end((err, res) => {
        expect(res.status).to.equal(400);
        done();
      });
  });
  it('it should GET /api/project_status/:projectName', (done) => {
    chai.request(server)
      .get('/api/project_status/ACC')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.errors).to.be.undefined;
        expect(res.body).not.to.deep.equal([]);
        done();
      });
  });
  it('it should GET /api/project_status_summary', (done) => {
    chai.request(server)
      .get('/api/project_status_summary')
      .end((err, res) => {
        expect(res.status).to.equal(400);
        done();
      });
  });
  it('it should GET /api/project_status_summary/:_id', (done) => {
    chai.request(server)
      .get('/api/project_status_summary/ACC')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.errors).to.be.undefined;
        expect(res.body).not.to.deep.equal([]);
        done();
      });
  });
  it('it should GET /api/donor_workflows', (done) => {
    chai.request(server)
      .get('/api/donor_workflows')
      .end((err, res) => {
        expect(res.status).to.equal(400);
        done();
      });
  });
  it('it should GET /api/donor_workflows/:donorName', (done) => {
    chai.request(server)
      .get('/api/donor_workflows/ACC_0001')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.errors).to.be.undefined;
        expect(res.body).not.to.deep.equal([]);
        done();
      });
  }).timeout(5000);
  it('it should GET /api/donor_workflows_summary', (done) => {
    chai.request(server)
      .get('/api/donor_workflows_summary')
      .end((err, res) => {
        expect(res.status).to.equal(400);
        done();
      });
  });
  it('it should GET /api/donor_workflows_summary/:donorName', (done) => {
    chai.request(server)
      .get('/api/donor_workflows_summary/PCSI_0006')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.errors).to.be.undefined;
        expect(res.body).not.to.deep.equal([]);
        done();
      });
  });
  it('it should GET /api/donor_details', (done) => {
    chai.request(server)
      .get('/api/donor_details')
      .end((err, res) => {
        expect(res.status).to.equal(400);
        done();
      });
  });
  it('it should GET /api/donor_details/:donorName', (done) => {
    chai.request(server)
      .get('/api/donor_details/PCSI_0006')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.errors).to.be.undefined;
        expect(res.body).not.to.deep.equal([]);
        done();
      });
  });
  it('it should GET /api/graph_data/:iusswid', (done) => {
    chai.request(server)
      .get('/api/graph_data/36285')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.errors).to.be.undefined;
        expect(res.body).not.to.deep.equal([]);
        done();
      });
  }); 
});
