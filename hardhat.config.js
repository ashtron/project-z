require("@nomicfoundation/hardhat-toolbox")
require('dotenv').config()

task("envtest", async (args, hre) => {
  console.log("Hello!")
})

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.10",
  networks: {
    hardhat: {
      forking: {
        url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
        blockNumber: 15649165
      }
    }
  }
}
