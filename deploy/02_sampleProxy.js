// Defining bytecode and abi from original contract on mainnet to ensure bytecode matches and it produces the same pair code hash

module.exports = async function ({ ethers, getNamedAccounts, deployments, getChainId }) {
  const { deploy } = deployments
  const { deployer } = await getNamedAccounts()

  const logicContract = await deployments.get('LogicContract');


  await deploy('SampleProxy', {
    from: deployer,
    log: true,
    args: [logicContract.address],
    deterministicDeployment: false,
  })
}

module.exports.tags = ["SampleProxyEIP1967"];
module.exports.dependencies = ["LogicContract"];
