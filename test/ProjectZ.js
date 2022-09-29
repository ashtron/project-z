const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")
const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("ProjectZ contract", function() {
    async function deployTokenFixture() {
        const [signer1, signer2, signer3] = await ethers.getSigners()

        const ProjectZFactory = await ethers.getContractFactory("ProjectZ")
        const ProjectZ = await ProjectZFactory.deploy()
        await ProjectZ.deployed()

        return { ProjectZ, signer1, signer2, signer3 }
    }

    it("Can create a new Agreement", async function() {
        const { ProjectZ, signer1, signer2 } = await loadFixture(deployTokenFixture)

        const [addr1, addr2, price, sellerYieldPercentage, expirationBlock] = [
            signer1.address,
            signer2.address,
            ethers.utils.parseUnits("1", "ether"),
            50,
            21
        ]
        
        await ProjectZ.createAgreement(addr1, addr2, price, sellerYieldPercentage, expirationBlock, { value: ethers.utils.parseUnits("1", "ether") })
        const agreement = await ProjectZ.agreements(0)

        expect(agreement.buyer).to.equal(signer1.address)
        expect(agreement.seller).to.equal(signer2.address)
        expect(agreement.price).to.equal(ethers.utils.parseUnits("1", "ether"))
        expect(agreement.buyerSigned).to.equal(true)
        expect(agreement.sellerSigned).to.equal(false)
        expect(agreement.sellerYieldPercentage).to.equal(50)
        const latestBlock = await hre.ethers.provider.getBlock("latest")
        expect(agreement.expirationBlock).to.equal(latestBlock.timestamp + 21)
    })

    it("Only allows the buyer to create a new Agreement", async function() {
        const { ProjectZ, signer1, signer2, signer3 } = await loadFixture(deployTokenFixture)

        const [addr1, addr2, price, sellerYieldPercentage, expirationBlock] = [
            signer1.address,
            signer2.address,
            ethers.utils.parseUnits("1", "ether"),
            50,
            21
        ]

        await ProjectZ.createAgreement(addr1, addr2, price, sellerYieldPercentage, expirationBlock, { value: ethers.utils.parseUnits("1", "ether") })
        const firstAgreement = await ProjectZ.agreements(0)

        await expect(ProjectZ.connect(signer3).createAgreement(addr1, addr2, price, sellerYieldPercentage, expirationBlock)).to.be.revertedWith("Only the Buyer can create a new Agreement.")
    })

    it("Creating an Agreement fails if the Agreement is funded incorrectly", async function() {
        const { ProjectZ, signer1, signer2, signer3 } = await loadFixture(deployTokenFixture)

        const [addr1, addr2, price, sellerYieldPercentage, expirationBlock] = [
            signer1.address,
            signer2.address,
            ethers.utils.parseUnits("1", "ether"),
            50,
            21
        ]

        await expect(ProjectZ.createAgreement(addr1, addr2, price, sellerYieldPercentage, expirationBlock, { value: ethers.utils.parseUnits("0.5", "ether") }))
            .to.be.revertedWith("Incorrect amount sent for funding.")
    })

    it("Allows the Seller to sign an existing Agreement", async function() {
        const { ProjectZ, signer1, signer2, signer3 } = await loadFixture(deployTokenFixture)

        const [addr1, addr2, price, sellerYieldPercentage, expirationBlock] = [
            signer1.address,
            signer2.address,
            ethers.utils.parseUnits("1", "ether"),
            50,
            21
        ]

        await ProjectZ.createAgreement(addr1, addr2, price, sellerYieldPercentage, expirationBlock, { value: ethers.utils.parseUnits("1", "ether") })

        let agreement = await ProjectZ.agreements(0)
        await expect(agreement.sellerSigned).to.equal(false)

        await ProjectZ.connect(signer2).signAgreement(0)
        
        agreement = await ProjectZ.agreements(0)
        await expect(agreement.sellerSigned).to.equal(true)
    })

    it("Allows ONLY the Seller to sign an existing Agreement", async function() {
        const { ProjectZ, signer1, signer2, signer3 } = await loadFixture(deployTokenFixture)

        const [addr1, addr2, price, sellerYieldPercentage, expirationBlock] = [
            signer1.address,
            signer2.address,
            ethers.utils.parseUnits("1", "ether"),
            50,
            21
        ]

        await ProjectZ.createAgreement(addr1, addr2, price, sellerYieldPercentage, expirationBlock, { value: ethers.utils.parseUnits("1", "ether") })

        await expect(ProjectZ.signAgreement(0)).to.be.revertedWith("Only the Seller can sign an Agreement.")
        await expect(ProjectZ.connect(signer3).signAgreement(0)).to.be.revertedWith("Only the Seller can sign an Agreement.")
    })
})