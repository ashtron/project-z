const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")
const { expect } = require("chai")

describe("ProjectZ contract", function() {
    async function deployTokenFixture() {
        const [signer1, signer2] = await ethers.getSigners()

        const ProjectZFactory = await ethers.getContractFactory("ProjectZ")
        const ProjectZ = await ProjectZFactory.deploy()
        await ProjectZ.deployed()

        return { ProjectZ, signer1, signer2 }
    }

    it("Can create a new agreement", async function() {
        const { ProjectZ, signer1, signer2 } = await loadFixture(deployTokenFixture)
        
        await ProjectZ.createAgreement(
            signer1.address,
            signer2.address,
            1,
            50,
            21
        )

        console.log(await ProjectZ.agreements(0))
    })
})