/* eslint-disable arrow-body-style, prefer-arrow/prefer-arrow-functions, no-undef */

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

require('dotenv').config();

chai.use(chaiHttp);

exports.mochaHooks = {
  async beforeAll() {
    admin = chai.request.agent(app);

    adminData = await admin
      .post('/user/login')
      .type('json')
      .send({
        email: process.env.TEST_EMAIL,
        password: process.env.TEST_PASSWORD,
      })
      .then((res) => JSON.parse(res.text).auth);
  },
};
