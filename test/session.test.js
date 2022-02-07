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
  required: ['auth', 'message'],
  properties: {
    message: { type: 'string' },
    auth: {
      type: 'object',
      required: ['id', 'userName', 'email', 'walletId'],
      properties: {
        message: { type: 'string' },
        userName: { type: 'string' },
        email: { type: 'string' },
        walletId: { type: 'object' },
      },
    },
  },
};

describe('POST /user/login', () => {
  it('Should login, response with cookie and user data', (done) => {
    chai
      .request(app)
      .post('/user/login')
      .type('json')
      .send({
        email: process.env.CALLGURUADMIN_EMAIL,
        password: process.env.CALLGURUADMIN_PASSWORD,
      })
      .end((err, res) => {
        // eslint-disable-next-line no-unused-expressions
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.have.cookie('my.sid');
        expect(res.body).to.have.property('auth');
        expect(res.body).to.have.nested.property('auth.id');

        this.successfullResponse = res.body;

        done();
      });
  });

  it('Successful login response should match schema', () => {
    expect(this.successfullResponse).to.be.jsonSchema(authSchema);
  });

  it('Should reject when wrong password is entered', (done) => {
    chai
      .request(app)
      .post('/user/login')
      .type('json')
      .send({
        email: process.env.CALLGURUADMIN_EMAIL,
        password: '',
      })
      .end((err, res) => {
        // eslint-disable-next-line no-unused-expressions
        expect(err).to.be.null;
        expect(res).to.have.status(401); // 401 because we do not want to give away information whether the email exists

        done();
      });
  });

  it('Should reject with 401 when wrong email is entered', (done) => {
    chai
      .request(app)
      .post('/user/login')
      .type('json')
      .send({
        email: 'abc@xyz.de',
        password: '',
      })
      .end((err, res) => {
        // eslint-disable-next-line no-unused-expressions
        expect(err).to.be.null;
        expect(res).to.have.status(401); // 401 because we do not want to give away information whether the email exists

        done();
      });
  });

  it('Should reject with 422 when no email is entered', (done) => {
    chai
      .request(app)
      .post('/user/login')
      .type('json')
      .send({
        email: 'abcdef',
        password: '',
      })
      .end((err, res) => {
        // eslint-disable-next-line no-unused-expressions
        expect(err).to.be.null;
        expect(res).to.have.status(422); // 422 because input is not an email

        done();
      });
  });
});
