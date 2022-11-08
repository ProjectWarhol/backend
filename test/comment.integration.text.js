/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-undef */

const bcrypt = require('bcrypt');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const db = require('../app/models');

require('dotenv').config();

chai.use(chaiHttp);
chai.should();

let testUserId;
let testUserCookie;
let nftContentId;

// Test Comment Controller
describe('Comment controller', function () {
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

  it('Comment route should return Status message 200', (done) => {
    chai
      .request(app)
      .post(`/comments/${nftContentId.dataValues.id}`)
      .set('Cookie', testUserCookie)
      .send({
        comment: 'This is a comment',
        userId: testUserId,
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.should.have.property('body');
        res.body.should.have.property('message');
        res.body.message.should.equal('Comment created successfully');
        done();
      });
  });
});
