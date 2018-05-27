const QABox = artifacts.require('./QABox.sol')

module.exports = function(deployer) {
  deployer.then(() => deployer.deploy(QABox))
}
