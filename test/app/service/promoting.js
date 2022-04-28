/* eslint-disable no-undef */
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require("sinon-chai");
const { getPromotions, getPromoters } = require('../../../app/service/promoting');

const { expect, assert } = chai;
chai.use(sinonChai);

const mockResponse = () => {
  const res = {};
  res.status = sinon.stub().returns(res);
  res.send = sinon.stub().returns(res);
  return res;
};

const goodMockUser = {
  getUserPromotions: async () => [{ 
    User: {
      id: 'randomId',
      userName: 'massi',
      email: 'massi.ricci@warhol.com',
      avatar: 'something',
      bio: 'somebio',
      promoters: 1240,
      promoting: 1560,
      verified: true,
      walletId: 'somewalletId',
      passwordHash: 'secretpasshash',
      resetToken: 'atoken',
      resetTokenExp: 'timestamp',
    }
  }],

  getUserPromoters: async () => [{ 
    User: {
      id: 'randomId',
      userName: 'massi',
      email: 'massi.ricci@warhol.com',
      avatar: 'something',
      bio: 'somebio',
      promoters: 1240,
      promoting: 1560,
      verified: true,
      walletId: 'somewalletId',
      passwordHash: 'secretpasshash',
      resetToken: 'atoken',
      resetTokenExp: 'timestamp',
    }
  }],
};

const badMockUser = {
  getUserPromotions: async () => new Error(),
  getUserPromoters: async () => new Error(),
};

describe('unit - getPromotions', () => {

  it('should map promotions correctly', async () => {
    const res = mockResponse();
    const promotions = await getPromotions(goodMockUser, res);

    assert.propertyVal(promotions[0], 'userName', 'massi');
    assert.notProperty(promotions[0], 'passwordHash');
    // eslint-disable-next-line no-unused-expressions
    expect(res.status).to.have.not.been.called;
    // eslint-disable-next-line no-unused-expressions
    expect(res.send).to.have.not.been.called;
  });
  
  it('should handle errors gracefully', async () => {
    const res = mockResponse();
    await getPromotions(badMockUser, res);

    expect(res.status).to.have.been.calledWith(500);
    expect(res.send).to.have.been.calledWith({
      error: {
        status: 500,
        message: `Internal Server Error: Something went wrong while fetching promotions`,
      },
    });
  })
});

describe('unit - getPromoters', () => {

  it('should map promoters correctly', async () => {
    const res = mockResponse();
    const promoters = await getPromoters(goodMockUser, res);
    assert.propertyVal(promoters[0], 'userName', 'massi');
    assert.notProperty(promoters[0], 'passwordHash');
    // eslint-disable-next-line no-unused-expressions
    expect(res.status).to.have.not.been.called;
    // eslint-disable-next-line no-unused-expressions
    expect(res.send).to.have.not.been.called;
  });
  
  it('should handle errors gracefully', async () => {
    const res = mockResponse();
    await getPromoters(badMockUser, res);

    expect(res.status).to.have.been.calledWith(500);
    expect(res.send).to.have.been.calledWith({
      error: {
        status: 500,
        message: `Internal Server Error: Something went wrong while fetching promoters`,
      },
    });
  })
});
