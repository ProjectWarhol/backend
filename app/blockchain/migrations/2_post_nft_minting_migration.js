const PostNftMinting = artifacts.require('PostNftMinting');

module.exports = async function (deployer) {
  await deployer.deploy(PostNftMinting);
};
