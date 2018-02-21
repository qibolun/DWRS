var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var SafeMath = artifacts.require("./SafeMath.sol");
var Gamble = artifacts.require("./Gamble.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);

  deployer.deploy(SafeMath);
  deployer.link(SafeMath, Gamble);
  deployer.deploy(Gamble);
};
