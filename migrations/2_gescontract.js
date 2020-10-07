const Gescontract = artifacts.require("./Gescontract.sol");

module.exports = function (deployer) {
    deployer.deploy(Gescontract);
};
