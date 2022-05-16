const Leilao = artifacts.require("Leilao");

module.exports = function (deployer) {
  deployer.deploy(Leilao);
};
