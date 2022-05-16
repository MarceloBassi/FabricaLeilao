const GMalatoToken = artifacts.require("GMalatoToken");

module.exports = function (deployer) {
  deployer.deploy(GMalatoToken);
};
