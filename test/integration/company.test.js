/* eslint-disable func-names */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-undef */

const bcrypt = require('bcrypt');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app');
const db = require('../../app/models');

require('dotenv').config();

chai.use(chaiHttp);
chai.should();

describe('Integration Test', function () {
  let testUserId;
  let testUserCookie;

  before(async function () {
    // this.timeout(30000);
    const agent = chai.request.agent(app);

    // drop all tables
    await db.sequelize.sync({ force: true });

    // Create test user
    await db.User.create({
      userName: 'testUser',
      email: 'test@test.com',
      password: 'testPassword',
      passwordHash: await bcrypt.hash('testPassword', 12),
    });

    // Login test user
    agent
      .post('/users/login')
      .type('json')
      .send({
        userCredential: 'testUser',
        password: 'testPassword',
      })

      .end((err, res) => {
        res.should.have.status(200);
        // eslint-disable-next-line prefer-destructuring
        this.testUserCookie = res.headers['set-cookie'][0];
        testUserCookie = this.testUserCookie;
      });

    await db.User.findOne({
      where: {
        userName: 'testUser',
      },
    }).then((user) => {
      testUserId = user.id;
    });
  });

  describe('Create Company', function () {
    it('Company route should return Status message 404', function (done) {
      chai
        .request(app)
        .post('/post-companies')

        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
    it('Company route should return Status message 403', function (done) {
      chai
        .request(app)
        .post('/company')
        .set('Cookie', 'notACookie')

        .end((err, res) => {
          res.should.have.status(403);
          done();
        });
    });
    it('CompanyOwner should be false before creation', function (done) {
      db.User.findOne({
        where: {
          userName: 'testUser',
        },
      }).then((user) => {
        user.isCompanyOwner.should.equal(false);
        done();
      });
    });

    it('Company route should return Status message 200', function (done) {
      chai
        .request(app)
        .post('/company')
        .set('Cookie', testUserCookie)
        .type('json')
        .send({
          userId: testUserId,
          companyName: 'testCompany',
          address: 'testAddress',
          website: 'testWebsite.com',
          companyLogo: 'testLogo',
        });
      done().end((err, res) => {
        res.should.have.status(200);
        res.data.should.be.a('object');
        res.data.should.have.property('companyName');
        res.data.should.have.property('address');
        res.data.should.have.property('website');
        res.data.should.have.property('companyLogo');
      });
    });
    it('Company route should return Status message 400', function (done) {
      chai
        .request(app)
        .post('/company')
        .set('Cookie', testUserCookie)
        .type('json')
        .send({
          userId: testUserId,
          companyName: 'testCompany',
          address: 'testAddress',
          website: 'testWebsite.com',
          companyLogo: 'testLogo',
        });
      done();
      res.should.have.status(400);
    });

    it('Company should contain the test data', function (done) {
      db.Company.findOne({
        where: {
          companyName: 'testCompany',
        },
      }).then((company) => {
        company.companyName.should.equal('testCompany');
        company.address.should.equal('testAddress');
        company.website.should.equal('testWebsite.com');
        company.companyLogo.should.equal('testLogo');
      });
      done();
    });
    it('CompanyOwner should be true after creation', function (done) {
      db.User.findOne({
        where: {
          userName: 'testUser',
        },
      }).then((user) => {
        user.companyOwner.should.equal(true);
      });
      done();
    });
  });
  describe('Patch Company', function () {
    it('Company route should return Status message 404', function (done) {
      chai
        .request(app)
        .patch('/patch-companies')

        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
    it('Company route should return Status message 403', function (done) {
      chai
        .request(app)
        .patch('/company')
        .set('Cookie', 'notACookie')

        .end((err, res) => {
          res.should.have.status(403);
          done();
        });
    });

    it('Company route should return Status message 200', function (done) {
      let testCompanyId;
      db.Company.findOne({
        where: {
          companyName: 'testCompany',
        },
      }).then((company) => {
        testCompanyId = company.id;
      });
      chai
        .request(app)
        .patch('/company')
        .set('Cookie', testUserCookie)
        .type('json')
        .send({
          companyId: testCompanyId,
          companyName: 'testCompany2',
          address: 'testAddress2',
          website: 'testWebsite2.com',
          companyLogo: 'testLogo2',
        });
      done().end((err, res) => {
        res.should.have.status(200);
      });
    });
    it('Company db should contain the patched test data', function (done) {
      db.Company.findOne({
        where: {
          companyName: 'testCompany2',
        },
      }).then((company) => {
        company.companyName.should.equal('testCompany2');
        company.address.should.equal('testAddress2');
        company.website.should.equal('testWebsite2.com');
        company.companyLogo.should.equal('testLogo2');
      });
      done();
    });
  });
  describe('Delete Company', function () {
    it('Company route should return Status message 404', function (done) {
      chai
        .request(app)
        .delete('/delete-companies')

        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
    it('Company route should return Status message 403', function (done) {
      chai
        .request(app)
        .delete('/company')
        .set('Cookie', 'notACookie')

        .end((err, res) => {
          res.should.have.status(403);
          done();
        });
    });

    it('Company route should return Status message 200', function (done) {
      let testCompanyId;
      db.Company.findOne({
        where: {
          companyName: 'testCompany2',
        },
      }).then((company) => {
        testCompanyId = company.id;
      });
      chai
        .request(app)
        .delete('/company')
        .set('Cookie', testUserCookie)
        .type('json')
        .send({
          companyId: testCompanyId,
        });
      done().end((err, res) => {
        res.should.have.status(200);
      });
    });
    it('Company db should not contain the deleted test data', function (done) {
      db.Company.findOne({
        where: {
          companyName: 'testCompany2',
        },
      }).then((company) => {
        company.should.equal(null);
      });
      done();
    });
  });
});
