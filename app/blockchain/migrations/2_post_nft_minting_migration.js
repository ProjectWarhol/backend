const PostNftMinting = artifacts.require('PostNftMinting');

module.exports = function (deployer) {
  deployer.deploy(PostNftMinting);
};
