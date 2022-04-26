/* eslint-disable no-undef */
const chai = require('chai');
const { expect } = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../../../app');
const { sequelize } = require('../../../../app/models');
const { getAgent } = require('../../../1session.test')

chai.use(chaiHttp);
require('dotenv').config();

let userId;

const agent = getAgent();

describe('GET /promoting', () => {

  before(async () => {
    userId = await sequelize.getQueryInterface().sequelize.query(`SELECT "id" FROM "User" WHERE "email"='${process.env.TEST_EMAIL}'`);
    userId = userId[0][0].id;
  });

  it('should return a list of promoted users', (done) => {
    agent
      .get(`/promoting/${userId}`)
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
      .get(`/promoting/${userId}`)
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
      .get(`/promoted/${userId}`)
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
      .get(`/promoted/${userId}`)
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

});
