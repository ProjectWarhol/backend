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
    this.timeout(10000);
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

  describe('Create Comment', function () {
    let nftContentId;
    before(async function () {
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

    it('Comment route should return Status message 404', function (done) {
      chai
        .request(app)
        .post('/comments/')
        .send({
          comment: 'This is a comment',
        })
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
    it('Comment route should return Status message 403', function (done) {
      chai
        .request(app)
        .post('/comments/1bab5c31-f3ce-4d29-ad89-3c1a805fed9c')
        .send({
          comment: 'This is a comment',
        })
        .end((err, res) => {
          res.should.have.status(403);
          done();
        });
    });

    it('Comment route should return Status message 200', async () => {
      const req = chai
        .request(app)
        .post(`/comments/${nftContentId.dataValues.id}`)
        .set('Cookie', testUserCookie);

      const res = await req.send({
        comment: 'This is a comment',
        userId: testUserId,
      });

      res.should.have.status(200);
      res.should.have.property('body');
      res.body.should.have.property('message');
      res.body.message.should.equal('Comment created successfully');
    });
  });

  describe('Delete Comment', function () {
    let comment;
    before(async function () {
      await db.Comment.create({
        comment: 'This is a comment made for deletion',
        userId: testUserId,
      });
      await db.Comment.findOne({
        where: {
          comment: 'This is a comment made for deletion',
        },
      }).then((testComment) => {
        comment = testComment;
      });
    });

    it('Comment route should return Status message 404', function (done) {
      chai
        .request(app)
        .delete('/comments/')
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
    it('Comment route should return Status message 403', function (done) {
      chai
        .request(app)
        .delete('/comments/1bab5c31-f3ce-4d29-ad89-3c1a805fed9c')
        .end((err, res) => {
          res.should.have.status(403);
          done();
        });
    });

    it('Comment route should return Status message 200', async () => {
      const req = chai
        .request(app)
        .delete(`/comments/${comment.dataValues.id}`)
        .set('Cookie', testUserCookie);

      const res = await req.send({
        comment: 'This is a comment',
        userId: testUserId,
      });

      res.should.have.status(200);
      res.body.should.have.property('message');
      res.body.message.should.equal('Comment deleted successfully');
    });
  });

  describe('Update Comment', function () {
    let comment;
    let updatedComment;

    before(async function () {
      await db.Comment.create({
        comment: 'This is a comment made for update',
        userId: testUserId,
      });
      await db.Comment.findOne({
        where: {
          comment: 'This is a comment made for update',
        },
      }).then((testComment) => {
        comment = testComment;
      });
    });
    it('Comment route should return Status message 404', function (done) {
      chai
        .request(app)
        .patch('/comments/')
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
    it('Comment route should return Status message 403', function (done) {
      chai
        .request(app)
        .patch('/comments/1bab5c31-f3ce-4d29-ad89-3c1a805fed9c')
        .end((err, res) => {
          res.should.have.status(403);
          done();
        });
    });
    it('Comment route should return Status message 200', function (done) {
      chai
        .request(app)
        .patch(`/comments/${comment.dataValues.id}`)
        .set('Cookie', testUserCookie)
        .send({
          comment: 'This is a new test comment',
          userId: testUserId,
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message');
          res.body.message.should.equal('Comment updated successfully');
          done();
        });
    });
    it('Comment should return the updated value', function () {
      before(async function () {
        await db.Comment.findOne({
          where: {
            commentId: comment.dataValues.id,
          },
        })
          .then((testComment) => {
            updatedComment = testComment;
          })
          .then(() => {
            updatedComment.dataValues.comment.should.equal(
              'This is a new test comment'
            );
          });
      });
    });
  });
  describe('Get Comment', function () {
    let nftContentId;

    before(async function () {
      // Create a test nft
      await db.NftContent.create({
        title: 'retrieveTestNft',
        description: 'testDescription',
        userId: testUserId,
      });
      await db.NftContent.findOne({
        where: {
          title: 'retrieveTestNft',
        },
      }).then((testNft) => {
        nftContentId = testNft;
      });

      await db.Comment.create({
        comment: 'This is a comment made to retrieve',
        userId: testUserId,
        contentId: nftContentId.dataValues.id,
      });
    });

    it('Retrieve Comment route should return Status message 404', function (done) {
      chai
        .request(app)
        .get('/comments/')
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
    it('Retrieve Comment route should return Status message 403', function (done) {
      chai
        .request(app)
        .get('/comments/1bab5c31-f3ce-4d29-ad89-3c1a805fed9c')
        .end((err, res) => {
          res.should.have.status(403);
          done();
        });
    });
    it('Retrieve Comment route should return Status message 200', function (done) {
      chai
        .request(app)
        .get(`/comments/${nftContentId.dataValues.id}`)
        .set('Cookie', testUserCookie)
        .send({
          offset: 0,
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message');
          res.body.message.should.equal('Comments sent successfully');
          res.body.should.have.property('data');
          res.body.data.should.be.a('array');
          res.body.data.should.have.lengthOf(1);
          done();
        });
    });
  });
});
