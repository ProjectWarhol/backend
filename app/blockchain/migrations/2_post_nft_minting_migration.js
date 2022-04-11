const PostNftMinting = artifacts.require('PostNftMinting');

module.exports = async function (deployer) {
  await deployer.deploy(PostNftMinting);
  if (process.env.NODE_ENV === 'test') {
    // for testing
    require('dotenv').config();
    const instance = await PostNftMinting.deployed();
    console.log(instance.address)
    process.env.CONTRACT_LOCAL_ADDRESS = instance.address;
  }
};
