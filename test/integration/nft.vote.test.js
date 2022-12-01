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
  let nftContentId;

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

    // Create a test nft
    await db.NftContent.create({
      title: 'testNft',
      description: 'testDescription',
      userId: testUserId,
    });
    await db.NftContent.findOne({
      where: {
        title: 'testNft',
      },
    }).then((testNft) => {
      nftContentId = testNft;
    });
  });

  describe('Create a Vote', function () {
    it(' Post Vote route should return Status message 404', function (done) {
      chai
        .request(app)
        .post(`/nft/vote/${nftContentId}`)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });

    it(' Get Vote route should return Status message 403', function (done) {
      chai
        .request(app)
        .post(`/vote/${nftContentId.dataValues.id}`)
        .set('Cookie', 'No Cookie')
        .end((err, res) => {
          res.should.have.status(403);
          done();
        });
    });

    it(' Get Vote route should return Status message 200', function (done) {
      chai
        .request(app)
        .post(`/vote/${nftContentId.dataValues.id}`)
        .set('Cookie', testUserCookie)
        .send({
          type: true,
          userId: testUserId,
        })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  describe('Update a Vote', function () {
    it(' Patch Vote route should return Status message 404', function (done) {
      chai
        .request(app)
        .patch(`/nft/vote/${nftContentId}`)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });

    it(' Patch Vote route should return Status message 403', function (done) {
      chai
        .request(app)
        .patch(`/vote/${nftContentId.dataValues.id}`)
        .set('Cookie', 'No Cookie')
        .end((err, res) => {
          res.should.have.status(403);
          done();
        });
    });

    it(' Patch Vote route should return Status message 200', function (done) {
      chai
        .request(app)
        .patch(`/vote/${nftContentId.dataValues.id}`)
        .set('Cookie', testUserCookie)
        .send({
          userId: testUserId,
        })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  describe('Fetch votes on a picture', function () {
    it('Get nft votes route should return Status message 404', function (done) {
      chai
        .request(app)
        .get('/nft.vote/1')
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
    it('Get nft votes route should return Status message 403', function (done) {
      chai
        .request(app)
        .get(`/vote/${nftContentId.dataValues.id}`)
        .end((err, res) => {
          res.should.have.status(403);
          done();
        });
    });
    it('Get nft votes route should return Status message 200', function (done) {
      chai
        .request(app)
        .get(`/vote/${nftContentId.dataValues.id}`)
        .set('Cookie', testUserCookie)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message');
          res.body.message.should.equal('Votes sent successfully');
          res.body.should.have.property('data');
          res.body.data.should.be.a('object');
          res.body.data.downvotes.should.equal(1);
          done();
        });
    });
  });

  describe('Delete a Vote', function () {
    it('Delete nft vote route should return Status message 404', function (done) {
      chai
        .request(app)
        .delete('/nft.vote/1')
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
    it('Delete nft vote route should return Status message 403', function (done) {
      chai
        .request(app)
        .delete(`/vote/${nftContentId.dataValues.id}`)
        .end((err, res) => {
          res.should.have.status(403);
          done();
        });
    });
    it('Delete nft vote route should return Status message 200', function (done) {
      chai
        .request(app)
        .delete(`/vote/${nftContentId.dataValues.id}`)
        .set('Cookie', testUserCookie)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message');
          res.body.message.should.equal('Vote deleted successfully');
          done();
        });
    });
    it('nft votes should contain no entry ', function (done) {
      db.NftContent.findOne({
        where: {
          id: nftContentId.dataValues.id,
        },
      }).then((nft) => {
        nft.upvotes.should.equal(0);
        nft.downvotes.should.equal(0);
        done();
      });
    });
  });
});
