/* eslint-disable no-undef */
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const db = require('../app/models');

require('dotenv').config();

chai.use(chaiHttp);
chai.should();

// Test Comment Controller
describe('Comment controller', () => {
  before(async (done) => {
    test = chai.request.agent(app);
    // Drop Database
    await db.sequelize.sync({ force: true });
    // Create User
    await db.User.create({
      userName: 'test',
      email: 'test@test.com',
      password: 'test',
    });
    // Login User
    const res = await chai.request(app).post('/users/login').type('json').send({
      userCredential: 'test',
      password: 'test',
    });
    // Set Authorization Header
    token = JSON.parse(res.text).auth.token;

    //     //Get Test User Id
    //     const userTestId = await db.User.findOne({
    //         where: {
    //             userName: 'test',
    //         },
    //         return : ['id']
    // });
    done();
  });

  it('Comment route should return Status message 404', (done) => {
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
  it('Comment route should return Status message 403', (done) => {
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
      .send({
        comment: 'This is a comment',
        userId: userTestId,
      })
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});
