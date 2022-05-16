const FabricaLeilao = artifacts.require("FabricaLeilao");

module.exports = function (deployer) {
  deployer.deploy(FabricaLeilao);
};
