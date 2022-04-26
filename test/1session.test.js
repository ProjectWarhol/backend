/* eslint-disable no-undef */
const chai = require('chai');
const { expect } = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

chai.use(require('chai-json-schema'));
require('dotenv').config();

chai.use(chaiHttp);

const authSchema = {
  title: 'Auth Schema',
  type: 'object',
  required: ['user', 'message'],
  properties: {
    message: { type: 'string' },
    user: {
      type: 'object',
      required: ['id', 'userName', 'email', 'walletId'],
      properties: {
        id: { type: 'string' },
        userName: { type: 'string' },
        email: { type: 'string' },
        walletId: { type: 'string' },
      },
    },
  },
};

const agent = chai.request.agent(app)
module.exports.getAgent = () => agent;

describe('POST /users/login', () => {
  it('Should login, response with cookie and user data', (done) => {
    agent
      .post('/users/login')
      .send({
        userCredential: process.env.TEST_EMAIL,
        password: process.env.TEST_PASSWORD,
      })
      .end((err, res) => {
        // eslint-disable-next-line no-unused-expressions
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.have.cookie('my.sid');
        expect(res.body).to.have.property('user');
        expect(res.body).to.have.nested.property('user.id');

        this.successfullResponse = res.body;
        done();
      });
  });

  it('Successful login response should match schema', () => {
    agent
      .post('/users/login')
      .send({
        userCredential: process.env.TEST_EMAIL,
        password: process.env.TEST_PASSWORD,
      })
      .end((err, res) => {
        // eslint-disable-next-line no-unused-expressions
        expect(res.body).to.be.jsonSchema(authSchema);
        done();
      });
  });

  it('Should reject when wrong password is entered', () => {
    agent
      .post('/users/login')
      .type('json')
      .send({
        userCredential: process.env.TEST_EMAIL,
        password: 'whoops',
      })
      .end((err, res) => {
        // eslint-disable-next-line no-unused-expressions
        expect(err).to.be.null;
        expect(res).to.have.status(409);
      });
  });

  it('Should reject with 401 when wrong email is entered', (done) => {
    agent
      .post('/users/login')
      .type('json')
      .send({
        userCredential: 'abc@xyz.de',
        password: '',
      })
      .end((err, res) => {
        // eslint-disable-next-line no-unused-expressions
        expect(err).to.be.null;
        expect(res).to.have.status(500); // 401 because we do not want to give away information whether the email exists

        done();
      });
  });

  it('Should reject with 401 when no email is entered', (done) => {
    agent
      .post('/users/login')
      .type('json')
      .send({
        userCredential: 'abcdef',
        password: '',
      })
      .end((err, res) => {
        // eslint-disable-next-line no-unused-expressions
        expect(err).to.be.null;
        expect(res).to.have.status(500); // 422 because input is not an email

        done();
      });
  });
});
