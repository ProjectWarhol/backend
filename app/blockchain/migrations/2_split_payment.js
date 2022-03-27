const SplitPayment = artifacts.require('SplitPayment');

module.exports = function (deployer) {
  // '0xC2F089A754fa423491c364884443fBEd76cCde05' == Project Owner
  // cannot be null
  deployer.deploy(
    SplitPayment,
    ['0xC2F089A754fa423491c364884443fBEd76cCde05'],
    [2]
  );
};
