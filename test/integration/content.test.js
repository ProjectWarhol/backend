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
  // let testUserId;
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

  describe('Get Content ', function () {
    it('Content route should return Status message 200', function (done) {
      chai
        .request(app)
        .get('/posts')
        .set('Cookie', testUserCookie)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });
});
