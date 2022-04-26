/* eslint-disable no-undef */
const chai = require('chai');
const { expect } = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../../../app');
const { sequelize } = require('../../../../app/models');
const { getAgent } = require('../../../1session.test')

chai.use(chaiHttp);
require('dotenv').config();

const agent = getAgent();

describe('GET /promoting', () => {

  it('should return a list of promoted users', (done) => {
    agent
      .get(`/promoting/${agent.id}`)
      .send()
      .end((err, res) => {
        // eslint-disable-next-line no-unused-expressions
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('data');
        done();
      })
  });

  it('should drop request if user is not logged in', (done) => {
    chai
      .request(app)
      .get(`/promoting/${agent.id}`)
      .send()
      .end((err, res) => {
        // eslint-disable-next-line no-unused-expressions
        expect(err).to.be.null;
        expect(res).to.have.status(403);
        done();
      })
  });

  it('should send 404 when user is not found', (done) => {
    agent
      .get(`/promoting/randomStr1ng!`)
      .send()
      .end((err, res) => {
        // eslint-disable-next-line no-unused-expressions
        expect(err).to.be.null;
        expect(res).to.have.status(404);
        expect(res.body).to.have.property('error');
        expect(res.body).to.have.nested.property('error.message', 'User Not found');
        done();
      })
  });
});

describe('GET /promoted', () => {

  it('should return a list of users promoting', (done) => {
    agent
      .get(`/promoted/${agent.id}`)
      .send()
      .end((err, res) => {
        // eslint-disable-next-line no-unused-expressions
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('data');
        done();
      })
  });

  it('should drop request if user is not logged in', (done) => {
    chai
      .request(app)
      .get(`/promoted/${agent.id}`)
      .send()
      .end((err, res) => {
        // eslint-disable-next-line no-unused-expressions
        expect(err).to.be.null;
        expect(res).to.have.status(403);
        done();
      })
  });

  it('should send 404 when user is not found', (done) => {
    agent
      .get(`/promoted/randomStr1ng!`)
      .send()
      .end((err, res) => {
        // eslint-disable-next-line no-unused-expressions
        expect(err).to.be.null;
        expect(res).to.have.status(404);
        expect(res.body).to.have.property('error');
        expect(res.body).to.have.nested.property('error.message', 'User Not found');
        done();
      })
  });
});

describe('POST /promoting', () => {
  let promotedId;

  before(async () => {
    await sequelize.getQueryInterface().sequelize.query(`DELETE FROM "Promoting" WHERE "userId"='${agent.id}'`);
    promotedId = await sequelize.getQueryInterface().sequelize.query(`SELECT "id" FROM "User" WHERE "id"!='${agent.id}' LIMIT 1;`);
    promotedId = promotedId[0][0].id;
  });

  it('should create a promotion successfully', (done) => {
    agent
      .post(`/promoting/${promotedId}`)
      .send({
        userId: agent.id,
      })
      .end((err, res) => {
        // eslint-disable-next-line no-unused-expressions
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message', 'Promotion added successfully');
        done();
      })
  });

  it('should not allow double entries', (done) => {
    agent
      .post(`/promoting/${promotedId}`)
      .send({
        userId: agent.id,
      })
      .end((err, res) => {
        // eslint-disable-next-line no-unused-expressions
        expect(err).to.be.null;
        expect(res).to.have.status(409);
        expect(res.body).to.have.nested.property('error.message', 'Conflict: Promotion already exists');
        done();
      })
  });

  it('should not create self-promotion', (done) => {
    agent
      .post(`/promoting/${agent.id}`)
      .send({
        userId: agent.id,
      })
      .end((err, res) => {
        // eslint-disable-next-line no-unused-expressions
        expect(err).to.be.null;
        expect(res).to.have.status(409);
        expect(res.body).to.have.nested.property('error.message', 'Conflict: Self-promotion');
        done();
      })
  });

  it('should drop request if user is not logged in', (done) => {
    chai
      .request(app)
      .post(`/promoting/${agent.id}`)
      .send()
      .end((err, res) => {
        // eslint-disable-next-line no-unused-expressions
        expect(err).to.be.null;
        expect(res).to.have.status(403);
        done();
      })
  });
});

describe('DELETE /promoting', () => {
  let promotedId;

  before(async () => {
    promotedId = await sequelize.getQueryInterface().sequelize.query(`SELECT "promotedId" FROM "Promoting" WHERE "userId"='${agent.id}' LIMIT 1;`);
    promotedId = promotedId[0][0].promotedId;
  });

  it('should delete a promotion successfully', (done) => {
    agent
      .delete(`/promoting/${promotedId}`)
      .send({
        userId: agent.id,
      })
      .end((err, res) => {
        // eslint-disable-next-line no-unused-expressions
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message', 'Promotion deleted successfully');
        done();
      })
  });

  it('should 404 if promotion is not found', (done) => {
    agent
      .delete(`/promoting/${agent.id}`)
      .send({
        userId: agent.id,
      })
      .end((err, res) => {
        // eslint-disable-next-line no-unused-expressions
        expect(err).to.be.null;
        expect(res).to.have.status(404);
        expect(res.body).to.have.nested.property('error.message', 'Promotion Not found');
        done();
      })
  });
});
