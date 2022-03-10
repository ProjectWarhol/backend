const NftMinting = artifacts.require('NftMinting');

module.exports = function (deployer) {
  deployer.deploy(NftMinting);
};
