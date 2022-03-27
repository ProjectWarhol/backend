const SplitPayment = artifacts.require('SplitPayment');
const PostNftMinting = artifacts.require('PostNftMinting');

module.exports = async function (deployer) {
  const instance = await SplitPayment.deployed()
  deployer.deploy(PostNftMinting, instance.address);
};
