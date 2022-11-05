/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-undef */

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const db = require('../app/models');

require('dotenv').config();

chai.use(chaiHttp);
chai.should();

// Test Comment Controller
describe('Comment controller', function () {
  before(async function () {
    this.timeout(10000);

    chai.request.agent(app);
    // drop all tables
    db.sequelize.sync({ force: true });

    // Create test user
    db.User.create({
      userName: 'testUser',
      email: 'test@test.com',
      password: 'testPassword',
    });

    // Login test user
    chai
      .request(app)
      .post('/users/login')

      .type('json')
      .send({
        userCredential: 'testUser',
        password: 'testPassword',
      })
      .end((err, res) => {
        res.should.have.status(200);

        done();
      });

    db.User.findOne({
      where: {
        userName: 'testUser',
      },
    }).then((user) => {
      this.userTestId = user.id;
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
      .post('/comments/1bab5c31-f3ce-4d29-ad89-3c1a805fed9c')
      //  .set('Cookie', 'connect.sid')
      .send({
        comment: 'This is a comment',
        userId: this.userTestId,
      })
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});
