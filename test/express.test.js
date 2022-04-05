/* eslint-disable no-undef */
const chai = require('chai');
const { expect } = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

chai.use(require('chai-json-schema'));
require('dotenv').config();

chai.use(chaiHttp);

const authSchema = {
  title: 'wallet schema',
  type: 'object',
  required: ['walletId', 'message', 'mnemonicPhrase', 'walletInformation'],
  properties: {
    message: { type: 'string' },
    walletId: { type: 'string' },
    mnemonicPhrase: { type: 'string' },
    walletInformation: {
      type: 'object',
      required: ['address', 'privateKey'],
      properties: {
        address: { type: 'string' },
        privateKey: { type: 'object' },
      },
    },
  },
};

describe('POST /users/express', () => {
  it('Should create a new user and send back wallet Information', (done) => {
    chai
      .request(app)
      .post('/users/express')
      .type('json')
      .send({
        email: process.env.TEST_EMAIL,
        password: process.env.TEST_PASSWORD,
        userName: process.env.TEST_USERNAME,
      })
      .end((err, res) => {
        // eslint-disable-next-line no-unused-expressions
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('walletInformation');
        expect(res.body).to.have.nested.property('walletInformation.address');

        this.successfullResponse = res.body;

        done();
      });
  });

  it('Successful signup response should match schema', () => {
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

  it('Should reject with 500 when wrong input is entered', (done) => {
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
        expect(res).to.have.status(500); // 401 because we do not want to give away information whether the email exists

        done();
      });
  });
});
