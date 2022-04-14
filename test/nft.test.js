/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
const chai = require('chai');
const { expect } = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

chai.use(require('chai-json-schema'));
require('dotenv').config();

chai.use(chaiHttp);

describe('POST /nft', () => {
  it('Should mint a image successfully', function (done) {
    this.timeout(0);
    chai
      .request(app)
      .post('/nft/mint')
      .field('Content-Type', 'multipart/form-data')
      .field('name', 'MezzyApe')
      .field('description', 'MeyyzApes in da club')
      .field('creatorUsername', 'heymage')
      .field('creatorAddress', '0x58238F9E0b59742BcfA1e507341D1da3dd80E4a1')
      .field('ownerAddress', '0x83d95ee20C4a7A514F88b85dff8F7E2cA77F12f6')
      .field('location', 'Berlin')
      .field('date', '2022-04-01')
      .field('amountSold', 0.0012)
      .field('positionInTree', 0)
      .attach('image', 'test/test_image.png')
      .end((err, res) => {
        console.log(res.body);
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('Successfully minted NFT');
        done();
      });
  });
});
